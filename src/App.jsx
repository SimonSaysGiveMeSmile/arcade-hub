import { GAMES } from "./games.js";

function GameCard({ g }) {
  const live = Boolean(g.url);
  return (
    <article className="card" style={{ "--c": g.c }}>
      <div className="thumb" style={{ "--c": g.c }}>
        <div className="badge-stack">
          <span className={`pill ${live ? "live" : "local"}`}>
            ● {live ? "Live" : "Local"}
          </span>
        </div>
        <div className="ico">{g.ico}</div>
      </div>
      <div className="body">
        <div className="title-row">
          <h2>{g.title}</h2>
          <span className="year">{g.year}</span>
        </div>
        <p className="desc">{g.desc}</p>
        <div className="tech">
          {g.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="actions">
          {live ? (
            <a
              className="btn play"
              href={g.url}
              target="_blank"
              rel="noopener"
              style={{ "--c": g.c }}
            >
              ▶ Play
            </a>
          ) : (
            <span
              className="btn play disabled"
              title="Deploy this game, then add its URL to GAMES[].url"
            >
              Not deployed
            </span>
          )}
          <a className="btn ghost" title={`Project folder: Games/${g.path}`}>
            {g.path}
          </a>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const allLive = GAMES.every((g) => g.url);
  return (
    <div className="wrap">
      <header>
        <span className="kicker">My Game Lab</span>
        <h1>
          The <span className="accent">Arcade</span>
        </h1>
        <p className="sub">
          Every browser game I've built — flight sims, open-world prototypes, and
          procedural horror. All playable in a tab.
        </p>
        <p className="count">
          <b>{GAMES.length}</b> games · click to play
        </p>
      </header>

      <main>
        <div className="grid">
          {GAMES.map((g) => (
            <GameCard key={g.path} g={g} />
          ))}
        </div>

        {!allLive && (
          <p className="note">
            <b>Heads up:</b> games marked “local” don't have a live URL yet. Deploy
            each game to Vercel (<code>cd &lt;game&gt; &amp;&amp; vercel --prod</code>),
            then paste its URL into the <code>url</code> field in{" "}
            <code>src/games.js</code>. The card flips to “live” automatically.
          </p>
        )}
      </main>

      <footer>
        Built by me · Hosted on Vercel · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
