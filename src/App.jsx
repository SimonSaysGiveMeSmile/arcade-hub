import { GAMES } from "./games.js";

function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/* Source + (for forks) the original open-source project, so contributors
   get credit. */
function Links({ g }) {
  if (!g.repo && !g.upstream) return null;
  return (
    <div className="links">
      {g.repo && (
        <a href={g.repo} target="_blank" rel="noopener">
          Source
        </a>
      )}
      {g.upstream && (
        <a
          href={g.upstream.url}
          target="_blank"
          rel="noopener"
          title={`Built on the open-source project: ${g.upstream.label}`}
        >
          Original&nbsp;↗
        </a>
      )}
    </div>
  );
}

/* A real gameplay capture, or an honest placeholder (never a fake shot). */
function Shot({ g, className }) {
  if (g.shot) {
    return (
      <img
        className={className}
        src={g.shot}
        alt={`${g.title} gameplay`}
        loading="lazy"
      />
    );
  }
  return (
    <div className={`${className} shot-fallback`} aria-hidden="true">
      <span className="fb-title">{g.title}</span>
      <span className="fb-hint">▶ play to view</span>
    </div>
  );
}

function Featured({ g }) {
  return (
    <section className="featured">
      <Shot g={g} className="featured-shot" />
      <div className="featured-scrim" />
      <div className="featured-body">
        <span className="kicker">Featured</span>
        <h2>
          {g.title}
          {g.sub && <span className="sub"> · {g.sub}</span>}
        </h2>
        <p>{g.blurb}</p>
        <Tags items={g.tags} />
        <div className="actions">
          <a className="btn primary" href={g.url} target="_blank" rel="noopener">
            ▶ Play
          </a>
          <Links g={g} />
        </div>
      </div>
    </section>
  );
}

function Card({ g, i }) {
  return (
    <article className="card" style={{ "--i": i }}>
      <a
        className="card-shot"
        href={g.url}
        target="_blank"
        rel="noopener"
        aria-label={`Play ${g.title}`}
      >
        <Shot g={g} className="card-img" />
      </a>
      <div className="card-body">
        <h3>
          {g.title}
          {g.sub && <span className="sub"> · {g.sub}</span>}
        </h3>
        <p>{g.blurb}</p>
        <Tags items={g.tags} />
        {g.note && <p className="note">{g.note}</p>}
        <div className="card-foot">
          <a className="btn primary sm" href={g.url} target="_blank" rel="noopener">
            ▶ Play
          </a>
          <Links g={g} />
        </div>
      </div>
    </article>
  );
}

export default function App() {
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
      </header>

      <Featured g={featured} />

      <h2 className="section">
        All games <span>{GAMES.length}</span>
      </h2>
      <div className="grid">
        {rest.map((g, i) => (
          <Card key={g.title + g.sub} g={g} i={i} />
        ))}
      </div>

      <footer className="foot">
        Built by{" "}
        <a
          href="https://github.com/SimonSaysGiveMeSmile"
          target="_blank"
          rel="noopener"
        >
          SimonSaysGiveMeSmile
        </a>{" "}
        · Hosted on Vercel · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
