import { updateStore, json, readBody } from './_store.js';

// POST { url } — the "overarching agent":
//   fetch the page → pull title/icon/OG-image/text → LLM writes a short
//   description + tags + a safety verdict → queue into `pending` for review.
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method' });
  let body;
  try { body = await readBody(req); } catch { return json(res, 400, { error: 'bad_json' }); }

  let url = String(body.url || '').trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  let parsed;
  try { parsed = new URL(url); } catch { return json(res, 400, { ok: false, reason: 'That doesn’t look like a valid link.' }); }
  if (!/^https?:$/.test(parsed.protocol)) return json(res, 400, { ok: false, reason: 'Only http(s) links are allowed.' });

  // 1) fetch the page (timeout + size cap)
  let html = '';
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 ArcadeHubBot' } });
    clearTimeout(t);
    if (!r.ok) return json(res, 200, { ok: false, reason: `The link returned HTTP ${r.status}.` });
    const buf = await r.arrayBuffer();
    html = Buffer.from(buf.slice(0, 400_000)).toString('utf8');
  } catch (e) {
    return json(res, 200, { ok: false, reason: 'Couldn’t reach that link (it may be offline or blocking bots).' });
  }

  // 2) extract metadata
  const meta = extractMeta(html, parsed);

  // 3) LLM: description + tags + safety
  let verdict;
  try {
    verdict = await analyze(meta);
  } catch (e) {
    return json(res, 200, { ok: false, reason: 'The description service is busy — try again in a moment.' });
  }
  if (!verdict.safe) {
    return json(res, 200, { ok: false, reason: verdict.reason || 'This doesn’t look like a game we can list.' });
  }

  // 4) build the card + queue for review
  const card = {
    id: 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    url,
    title: (verdict.title || meta.title || parsed.hostname).slice(0, 60),
    sub: 'Community',
    blurb: (verdict.description || meta.description || '').slice(0, 160),
    tags: Array.isArray(verdict.tags) ? verdict.tags.slice(0, 3).map((t) => String(t).slice(0, 18)) : [],
    shot: meta.image || null,
    submittedAt: new Date().toISOString(),
    community: true,
  };

  try {
    await updateStore((data) => {
      // light de-dupe: same URL already pending/published?
      const exists = [...data.pending, ...data.published].some((g) => g.url === card.url);
      if (!exists) data.pending.unshift(card);
    }, `submit ${card.title}`);
  } catch (e) {
    return json(res, 500, { ok: false, reason: 'Couldn’t save your submission — please retry.' });
  }

  json(res, 200, { ok: true, pending: true, card });
}

function extractMeta(html, parsed) {
  const pick = (re) => { const m = html.match(re); return m ? m[1].trim() : ''; };
  const abs = (u) => { if (!u) return ''; try { return new URL(u, parsed.origin).href; } catch { return ''; } };

  const title =
    pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<title[^>]*>([^<]+)<\/title>/i);
  const description =
    pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const image = abs(
    pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    pick(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i) ||
    pick(/<link[^>]+rel=["'][^"']*icon["'][^>]+href=["']([^"']+)["']/i)
  ) || abs('/favicon.ico');

  // crude body text for the LLM
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2500);

  return { title, description, image, text, host: parsed.hostname };
}

async function analyze(meta) {
  const prompt =
    `You are curating a personal portfolio of browser GAMES. A visitor submitted a link.\n` +
    `Decide if it is a legitimate, safe, playable browser game (not NSFW, malware, spam, a store page, or unrelated).\n\n` +
    `URL host: ${meta.host}\nPage title: ${meta.title}\nMeta description: ${meta.description}\n` +
    `Page text (truncated): ${meta.text}\n\n` +
    `Reply with ONLY a JSON object, no prose:\n` +
    `{"safe": boolean, "reason": "short reason if not safe", "title": "concise game title", ` +
    `"description": "one punchy sentence, <=140 chars, no hype", "tags": ["1-3","short","tags"]}`;

  const r = await fetch(process.env.LLM_BASE_URL + '/v1/messages', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.LLM_TOKEN,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error('llm ' + r.status);
  const j = await r.json();
  let text = j.content?.[0]?.text || '';
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no json');
  return JSON.parse(text.slice(start, end + 1));
}
