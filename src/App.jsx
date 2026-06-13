import { GAMES } from "./games.js";

/* Pure-CSS attract-mode dioramas — one per cabinet tube. Kept verbatim. */
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
      className={`cab ${g.flagship ? "flagship" : ""} ${live ? "" : "dead-cab"}`}
      style={{ "--c": g.c, "--i": i }}
    >
      <div className="marquee">
        <span
          className={`led ${live ? "on" : "off"}`}
          role="img"
          aria-label={live ? "online" : "offline"}
        />
        <h2>{g.title}</h2>
        <span className="year">{g.year}</span>
      </div>

      <a
        className={`tube ${live ? "" : "dead"}`}
        href={live ? g.url : undefined}
        target={live ? "_blank" : undefined}
        rel={live ? "noopener" : undefined}
        aria-label={live ? `Play ${g.title}` : `${g.title} — not deployed`}
        aria-disabled={live ? undefined : true}
      >
        <Scene scene={g.scene} />
        <span className="mode">{live ? "ATTRACT MODE" : "OFFLINE"}</span>
      </a>

      <div className="deck">
        <p className="desc">{g.desc}</p>
        <p className="spec">{g.spec}</p>
        <div className="actions">
          {live ? (
            <a className="btn play" href={g.url} target="_blank" rel="noopener">
              ▸ PLAY
            </a>
          ) : (
            <span className="btn disabled" aria-disabled="true">
              NOT DEPLOYED
            </span>
          )}
          {g.src && (
            <a
              className="btn source"
              href={g.src}
              target="_blank"
              rel="noopener"
              aria-label={`${g.title} source code`}
            >
              SOURCE ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const liveCount = GAMES.filter((g) => g.url).length;
  // The flagship leads the hall so its 2-column span never wraps awkwardly,
  // and it's the first cabinet to power on in the load sequence.
  const flagship = GAMES.find((g) => g.flagship) || GAMES[0];
  const ordered = [flagship, ...GAMES.filter((g) => g !== flagship)];

  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="wrap">
        <header>
          <div className="marquee-sign">
            <h1 className="wordmark">
              ARC<i className="dim">A</i>DE
            </h1>
            <p className="sub">
              Every browser game I've built — flight sims, open-world
              prototypes, and procedural horror. All playable in a tab.
            </p>
            <p className="status-led">
              <span>
                <b>{GAMES.length}</b> CABINETS
              </span>
              <span className="dot">·</span>
              <span>
                <b>{liveCount}</b> ONLINE
              </span>
            </p>
          </div>
        </header>

        <main>
          <div className="hall">
            {ordered.map((g, i) => (
              <Cabinet key={g.path} g={g} i={i} />
            ))}
          </div>
        </main>

        <footer>
          OPEN ALL NIGHT · BUILT BY ME · HOSTED ON VERCEL ·{" "}
          {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
}
