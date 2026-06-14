// GitHub-backed JSON datastore for ratings + community submissions.
// Reads/writes a single community.json in a SEPARATE repo so writes never
// trigger a hub redeploy. All creds come from env vars (never committed).
const OWNER = 'SimonSaysGiveMeSmile';
const REPO = process.env.GH_DATA_REPO || 'arcade-hub-data';
const FILE = 'community.json';
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`;

const ghHeaders = () => ({
  Authorization: `Bearer ${process.env.GH_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'arcade-hub',
});

export async function readStore() {
  const r = await fetch(API + '?ref=main', { headers: ghHeaders() });
  if (!r.ok) throw new Error('store read ' + r.status);
  const j = await r.json();
  const data = JSON.parse(Buffer.from(j.content, 'base64').toString('utf8'));
  data.ratings ||= {};
  data.pending ||= [];
  data.published ||= [];
  return { data, sha: j.sha };
}

async function writeStore(data, sha, message) {
  const r = await fetch(API, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      sha,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
    }),
  });
  if (r.status === 409) { const e = new Error('conflict'); e.conflict = true; throw e; }
  if (!r.ok) throw new Error('store write ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}

// Read-modify-write with optimistic-concurrency retry on 409.
export async function updateStore(mutate, message, tries = 5) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    const { data, sha } = await readStore();
    const result = mutate(data);
    try {
      await writeStore(data, sha, message);
      return result;
    } catch (e) {
      lastErr = e;
      if (e.conflict && i < tries - 1) { await new Promise((r) => setTimeout(r, 120 * (i + 1))); continue; }
      throw e;
    }
  }
  throw lastErr;
}

// Collapse the per-voter map into { gameId: { avg, count } }.
export function aggregateRatings(ratings) {
  const out = {};
  for (const [id, rec] of Object.entries(ratings || {})) {
    const votes = Object.values(rec.voters || {});
    if (!votes.length) continue;
    const sum = votes.reduce((a, b) => a + b, 0);
    out[id] = { avg: Math.round((sum / votes.length) * 10) / 10, count: votes.length };
  }
  return out;
}

export function json(res, code, body) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}
