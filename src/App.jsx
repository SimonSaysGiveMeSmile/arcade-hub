import { useState, useEffect, useCallback } from "react";
import { GAMES } from "./games.js";

const gid = (g) => g.id || g.title;

/* ── data layer ─────────────────────────────────────────────────── */
function useClientId() {
  const [id] = useState(() => {
    try {
      let v = localStorage.getItem("hubClient");
      if (!v) { v = "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("hubClient", v); }
      return v;
    } catch { return "anon"; }
  });
  return id;
}

function useHubData() {
  const [published, setPublished] = useState([]);
  const [ratings, setRatings] = useState({});
  const reload = useCallback(() => {
    fetch("/api/data")
      .then((r) => r.json())
      .then((d) => { setPublished(d.published || []); setRatings(d.ratings || {}); })
      .catch(() => {});
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { published, ratings, setRatings, reload };
}

/* ── star rating ────────────────────────────────────────────────── */
function Stars({ id, ratings, myVotes, onRate }) {
  const [hover, setHover] = useState(0);
  const agg = ratings[id];
  const mine = myVotes[id] || 0;
  const shown = hover || mine || Math.round(agg?.avg || 0);
  return (
    <div className="stars" onMouseLeave={() => setHover(0)}>
      <div className="star-row" role="group" aria-label="Rate this game">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={"star" + (n <= shown ? " on" : "") + (mine ? " voted" : "")}
            onMouseEnter={() => setHover(n)}
            onClick={() => onRate(id, n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            title={mine ? `You rated ${mine}★` : `Rate ${n}★`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="star-meta">
        {agg ? `${agg.avg.toFixed(1)} · ${agg.count}` : "be first"}
      </span>
    </div>
  );
}

/* ── shared bits ────────────────────────────────────────────────── */
function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

function Links({ g }) {
  if (!g.repo && !g.upstream) return null;
  return (
    <div className="links">
      {g.repo && <a href={g.repo} target="_blank" rel="noopener">Source</a>}
      {g.upstream && (
        <a href={g.upstream.url} target="_blank" rel="noopener"
          title={`Built on the open-source project: ${g.upstream.label}`}>Original&nbsp;↗</a>
      )}
    </div>
  );
}

function Shot({ g, className }) {
  const [failed, setFailed] = useState(false);
  if (g.shot && !failed) {
    return (
      <img className={className} src={g.shot} alt={`${g.title} gameplay`} loading="lazy"
        onError={() => setFailed(true)} />
    );
  }
  return (
    <div className={`${className} shot-fallback`} aria-hidden="true">
      <span className="fb-title">{g.title}</span>
      <span className="fb-hint">▶ play to view</span>
    </div>
  );
}

function Featured({ g, rateProps }) {
  return (
    <section className="featured">
      <Shot g={g} className="featured-shot" />
      <div className="featured-scrim" />
      <div className="featured-body">
        <span className="kicker">Featured</span>
        <h2>{g.title}{g.sub && <span className="sub"> · {g.sub}</span>}</h2>
        <p>{g.blurb}</p>
        <Tags items={g.tags} />
        <div className="actions">
          <a className="btn primary" href={g.url} target="_blank" rel="noopener">▶ Play</a>
          <Links g={g} />
        </div>
        <Stars id={gid(g)} {...rateProps} />
      </div>
    </section>
  );
}

function Card({ g, i, rateProps }) {
  return (
    <article className="card" style={{ "--i": i }}>
      <a className="card-shot" href={g.url} target="_blank" rel="noopener" aria-label={`Play ${g.title}`}>
        <Shot g={g} className="card-img" />
        {g.community && <span className="badge-community">Community</span>}
      </a>
      <div className="card-body">
        <h3>{g.title}{g.sub && <span className="sub"> · {g.sub}</span>}</h3>
        <p>{g.blurb}</p>
        <Tags items={g.tags} />
        {g.note && <p className="note">{g.note}</p>}
        <div className="card-foot">
          <a className="btn primary sm" href={g.url} target="_blank" rel="noopener">▶ Play</a>
          <Links g={g} />
        </div>
        <Stars id={gid(g)} {...rateProps} />
      </div>
    </article>
  );
}

/* ── submit your game ───────────────────────────────────────────── */
function SubmitModal({ open, onClose }) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState({ status: "idle", msg: "" });
  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setState({ status: "loading", msg: "Visiting your link & writing a description…" });
    try {
      const r = await fetch("/api/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const d = await r.json();
      if (d.ok) {
        setState({ status: "ok", msg: `“${d.card.title}” submitted — it’ll appear once it’s reviewed. Thanks!` });
        setUrl("");
      } else {
        setState({ status: "err", msg: d.reason || "Couldn’t add that link." });
      }
    } catch {
      setState({ status: "err", msg: "Network error — please try again." });
    }
  };

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close">×</button>
        <h3>Publish your game</h3>
        <p className="modal-sub">
          Paste a link to your browser game. A bot visits it, grabs an icon, and writes a
          short description. It’s added after a quick review.
        </p>
        <form onSubmit={submit}>
          <input className="modal-input" type="text" inputMode="url" placeholder="yourgame.com"
            value={url} onChange={(e) => setUrl(e.target.value)} autoFocus />
          <button className="btn primary" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Working…" : "Submit"}
          </button>
        </form>
        {state.msg && <p className={"modal-msg " + state.status}>{state.msg}</p>}
      </div>
    </div>
  );
}

/* ── admin review (key-gated, opened via #admin) ────────────────── */
function AdminPanel() {
  const [key, setKey] = useState(() => sessionStorage.getItem("hubAdminKey") || "");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState("");

  const call = useCallback(async (action, id) => {
    const r = await fetch("/api/admin", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, action, id }),
    });
    return r.json();
  }, [key]);

  const load = async () => {
    setMsg("Checking…");
    const d = await call("list");
    if (d.ok) { setAuthed(true); setPending(d.pending || []); setMsg(""); sessionStorage.setItem("hubAdminKey", key); }
    else { setMsg("Wrong key."); }
  };
  const act = async (action, id) => {
    await call(action, id);
    setPending((p) => p.filter((g) => g.id !== id));
  };

  return (
    <section className="admin">
      <h2 className="section">Review queue</h2>
      {!authed ? (
        <div className="admin-auth">
          <input className="modal-input" type="password" placeholder="admin key"
            value={key} onChange={(e) => setKey(e.target.value)} />
          <button className="btn primary sm" onClick={load}>Unlock</button>
          {msg && <span className="modal-msg err">{msg}</span>}
        </div>
      ) : pending.length === 0 ? (
        <p className="admin-empty">Nothing pending. 🎉</p>
      ) : (
        <div className="grid">
          {pending.map((g, i) => (
            <article className="card" key={g.id} style={{ "--i": i }}>
              <div className="card-shot"><Shot g={g} className="card-img" /></div>
              <div className="card-body">
                <h3>{g.title}</h3>
                <p>{g.blurb}</p>
                <Tags items={g.tags || []} />
                <a className="admin-url" href={g.url} target="_blank" rel="noopener">{g.url}</a>
                <div className="card-foot">
                  <button className="btn primary sm" onClick={() => act("approve", g.id)}>Approve</button>
                  <button className="btn ghost sm" onClick={() => act("reject", g.id)}>Reject</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── app ────────────────────────────────────────────────────────── */
export default function App() {
  const clientId = useClientId();
  const { published, ratings, setRatings, reload } = useHubData();
  const [myVotes, setMyVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hubVotes") || "{}"); } catch { return {}; }
  });
  const [submitOpen, setSubmitOpen] = useState(false);
  const isAdmin = typeof location !== "undefined" && location.hash === "#admin";

  const onRate = useCallback(async (id, stars) => {
    setMyVotes((m) => { const n = { ...m, [id]: stars }; try { localStorage.setItem("hubVotes", JSON.stringify(n)); } catch {} return n; });
    setRatings((r) => { // optimistic
      const cur = r[id] || { avg: 0, count: 0 };
      const had = myVotes[id] ? 1 : 0;
      const count = cur.count + (had ? 0 : 1);
      return { ...r, [id]: { avg: cur.avg || stars, count } };
    });
    try {
      const res = await fetch("/api/rate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: id, stars, clientId }),
      });
      const d = await res.json();
      if (d.ok) setRatings((r) => ({ ...r, [id]: { avg: d.avg, count: d.count } }));
    } catch {}
  }, [clientId, myVotes, setRatings]);

  const rateProps = { ratings, myVotes, onRate };
  const featured = GAMES.find((g) => g.featured) || GAMES[0];
  const rest = GAMES.filter((g) => g !== featured);

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <span className="name">Game&nbsp;Lab</span>
        </div>
        <p className="tagline">Browser games I've built — open one in a tab.</p>
        <button className="btn primary submit-cta" onClick={() => setSubmitOpen(true)}>+ Publish your game</button>
      </header>

      <Featured g={featured} rateProps={rateProps} />

      <h2 className="section">All games <span>{GAMES.length}</span></h2>
      <div className="grid">
        {rest.map((g, i) => <Card key={g.title + g.sub} g={g} i={i} rateProps={rateProps} />)}
      </div>

      {published.length > 0 && (
        <>
          <h2 className="section">Community <span>{published.length}</span></h2>
          <div className="grid">
            {published.map((g, i) => <Card key={g.id} g={g} i={i} rateProps={rateProps} />)}
          </div>
        </>
      )}

      {isAdmin && <AdminPanel />}

      <footer className="foot">
        Built by <a href="https://github.com/SimonSaysGiveMeSmile" target="_blank" rel="noopener">SimonSaysGiveMeSmile</a>
        {" "}· Hosted on Vercel · {new Date().getFullYear()}
      </footer>

      <SubmitModal open={submitOpen} onClose={() => { setSubmitOpen(false); reload(); }} />
    </div>
  );
}
