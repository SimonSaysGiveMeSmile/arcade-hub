import { updateStore, json, readBody } from './_store.js';

// POST { gameId, stars (1-5), clientId } — one vote per client, last wins.
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  let body;
  try { body = await readBody(req); } catch { return json(res, 400, { error: 'bad_json' }); }

  const gameId = String(body.gameId || '').slice(0, 120);
  const clientId = String(body.clientId || '').slice(0, 80);
  const stars = Math.round(Number(body.stars));
  if (!gameId || !clientId || !(stars >= 1 && stars <= 5)) {
    return json(res, 400, { error: 'invalid' });
  }

  try {
    const agg = await updateStore((data) => {
      const rec = (data.ratings[gameId] ||= { voters: {} });
      rec.voters ||= {};
      rec.voters[clientId] = stars;
      const votes = Object.values(rec.voters);
      const sum = votes.reduce((a, b) => a + b, 0);
      return { avg: Math.round((sum / votes.length) * 10) / 10, count: votes.length };
    }, `rate ${gameId} = ${stars}`);
    json(res, 200, { ok: true, gameId, ...agg });
  } catch (e) {
    json(res, 500, { error: 'store_write_failed' });
  }
}
