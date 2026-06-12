import { GAMES } from "./games.js";

/* Pure-CSS attract-mode dioramas — one per cabinet screen. */
function Scene({ scene }) {
  switch (scene) {
    case "f22":
      return (
        <div className="scene sc-f22">
          <div className="sky" />
          <div className="cloud c1" />
          <div className="cloud c2" />
          <div className="cloud c3" />
          <div className="horizon" />
          <div className="pitch p1" />
          <div className="pitch p2" />
          <div className="reticle" />
          <div className="hud-txt tl">SPD 480</div>
          <div className="hud-txt tr">ALT 12000</div>
        </div>
      );
    case "gta6":
      return (
        <div className="scene sc-gta6">
          <div className="sun" />
          <div className="skyline back" />
          <div className="skyline front" />
          <div className="strip" />
          <div className="car" />
        </div>
      );
    case "gtav":
      return (
        <div className="scene sc-gtav">
          <div className="stars" />
          <div className="towers" />
          <div className="gridfloor" />
        </div>
      );
    case "backrooms":
      return (
        <div className="scene sc-backrooms">
          <div className="ceiling">
            <i /><i /><i />
          </div>
          <div className="wall left" />
          <div className="wall right" />
          <div className="floor" />
          <div className="doorway" />
          <div className="flicker" />
        </div>
      );
    case "minecraft":
      return (
        <div className="scene sc-minecraft">
          <div className="mc-sky" />
          <div className="mc-ground" />
          <div className="vox v1" />
          <div className="vox v2" />
          <div className="vox v3" />
          <div className="vox v4" />
          <div className="vox v5" />
        </div>
      );
    case "scp":
      return (
        <div className="scene sc-scp">
          <div className="shelf s1" />
          <div className="shelf s2" />
          <div className="shelf s3" />
          <div className="aisle" />
          <div className="figure" />
          <div className="lights-out" />
        </div>
      );
    default:
      return <div className="scene" />;
  }
}

function Cabinet({ g, i }) {
  const live = Boolean(g.url);
  return (
    <article
      className="cab"
      style={{ "--c": g.c, "--d": `${i * 90}ms` }}
    >
      <div className="marquee">
        <span className={`led ${live ? "on" : "off"}`} />
        <h2>{g.title}</h2>
        <span className="year">{g.year}</span>
      </div>

      <a
        className={`screen ${live ? "" : "dead"}`}
        href={live ? g.url : undefined}
        target={live ? "_blank" : undefined}
        rel={live ? "noopener" : undefined}
        aria-label={live ? `Play ${g.title}` : `${g.title} (not deployed)`}
      >
        <Scene scene={g.scene} />
        <div className="glass" />
        <div className="press-start">
          {live ? "▸ PRESS START" : "OUT OF ORDER"}
        </div>
      </a>

      <div className="deck">
        <p className="desc">{g.desc}</p>
        <div className="tech">
          {g.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="actions">
          {live ? (
            <a className="btn play" href={g.url} target="_blank" rel="noopener">
              ▶ INSERT COIN
            </a>
          ) : (
            <span className="btn play disabled">NOT DEPLOYED</span>
          )}
          <span className="btn ghost" title={`Project folder: Games/${g.path}`}>
            /{g.path}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const liveCount = GAMES.filter((g) => g.url).length;
  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="wrap">
        <header>
          <p className="ticker">
            <span>
              MY GAME LAB ··· OPEN ALL NIGHT ··· NO QUARTERS REQUIRED ··· MY
              GAME LAB ··· OPEN ALL NIGHT ··· NO QUARTERS REQUIRED ···
            </span>
          </p>
          <h1>
            THE <span className="neon">ARC<i className="dying">A</i>DE</span>
          </h1>
          <p className="sub">
            Every browser game I've built — flight sims, open-world prototypes,
            and procedural horror. All playable in a tab.
          </p>
          <p className="status-line">
            <b>{GAMES.length}</b> CABINETS · <b>{liveCount}</b> ONLINE
            <span className="cursor">▮</span>
          </p>
        </header>

        <main>
          <div className="hall">
            {GAMES.map((g, i) => (
              <Cabinet key={g.path} g={g} i={i} />
            ))}
          </div>
        </main>

        <footer>
          BUILT BY ME · HOSTED ON VERCEL · {new Date().getFullYear()} ·
          MANAGEMENT IS NOT RESPONSIBLE FOR LOST SLEEP
        </footer>
      </div>
    </>
  );
}
