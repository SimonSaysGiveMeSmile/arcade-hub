import { readStore, updateStore, json, readBody } from './_store.js';

// POST { key, action: 'list' | 'approve' | 'reject', id? }
// Gated by ADMIN_KEY — this is how submissions get published (review queue).
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  let body;
  try { body = await readBody(req); } catch { return json(res, 400, { error: 'bad_json' }); }

  if (!process.env.ADMIN_KEY || body.key !== process.env.ADMIN_KEY) {
    return json(res, 401, { error: 'unauthorized' });
  }

  const action = body.action;
  try {
    if (action === 'list') {
      const { data } = await readStore();
      return json(res, 200, { ok: true, pending: data.pending, published: data.published });
    }
    if (action === 'approve') {
      const out = await updateStore((data) => {
        const idx = data.pending.findIndex((g) => g.id === body.id);
        if (idx === -1) return { found: false };
        const [card] = data.pending.splice(idx, 1);
        card.approvedAt = new Date().toISOString();
        data.published.unshift(card);
        return { found: true, card };
      }, `approve ${body.id}`);
      return json(res, 200, { ok: out.found, ...out });
    }
    if (action === 'reject') {
      const out = await updateStore((data) => {
        const before = data.pending.length;
        data.pending = data.pending.filter((g) => g.id !== body.id);
        return { found: data.pending.length < before };
      }, `reject ${body.id}`);
      return json(res, 200, { ok: out.found });
    }
    return json(res, 400, { error: 'bad_action' });
  } catch (e) {
    return json(res, 500, { error: 'store_error' });
  }
}
