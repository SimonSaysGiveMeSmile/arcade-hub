// ───────────────────────────────────────────────────────────────
// Each game: a real gameplay screenshot, a one-line intro, tags,
// a Play link, the source repo, and — for games built on an
// open-source project — the original upstream repo so the people
// who made it get credit.
//   shot:     /shots/<name>.jpg  (real in-game capture) or null
//   repo:     this build's source
//   upstream: { label, url } original open-source project (forks only)
// ───────────────────────────────────────────────────────────────
export const GAMES = [
  {
    title: "SCP-3008",
    sub: "The Infinite IKEA",
    blurb:
      "Multiplayer survival horror in an endless, procedurally-generated IKEA. Scavenge supplies, build a shelter, and survive the staff once the store closes.",
    tags: ["Survival Horror", "Multiplayer", "Three.js"],
    shot: "/shots/scp.jpg",
    url: "https://scp3008.vercel.app",
    repo: "https://github.com/SimonSaysGiveMeSmile/SCP3008",
    featured: true,
  },
  {
    title: "Cozy Cat Café Run",
    sub: "Endless Runner",
    blurb:
      "A sleepy café dash where you swap your runner between cats and memes — mid-jump. Build the vibe meter to PURR as day drifts into night.",
    tags: ["Endless Runner", "Cozy", "Canvas"],
    shot: "/shots/cozycat.jpg",
    url: "https://cozy-cat-cafe.vercel.app",
    repo: "https://github.com/SimonSaysGiveMeSmile/cozy-cat-cafe",
  },
  {
    title: "Minecraft Web",
    sub: "Word Builder",
    blurb:
      "A browser Minecraft with an AI twist: press B, describe anything — “a giant glass castle” — and watch it build itself block by block in front of you.",
    tags: ["Sandbox", "AI", "Three.js"],
    shot: "/shots/minecraft.jpg",
    url: "https://minecraft-web-phi.vercel.app",
    repo: "https://github.com/SimonSaysGiveMeSmile/minecraft-web",
    upstream: {
      label: "minecraft-threejs by Yulei Zhu",
      url: "https://github.com/Vyse12138/minecraft-threejs",
    },
  },
  {
    title: "Founder Simulator",
    sub: "GTA 6",
    blurb:
      "A stylized open city you roam on foot or by car — traffic, NPCs, pickups and a live HUD, all running in the browser.",
    tags: ["Open World", "Three.js", "R3F"],
    shot: "/shots/gta6.jpg",
    url: "https://gta6-beta.vercel.app",
  },
  {
    title: "Founder Simulator",
    sub: "WebGPU",
    blurb:
      "A clean-room, browser-only open-world prototype rendered on the bleeding-edge WebGPU pipeline with streaming sectors.",
    tags: ["Open World", "WebGPU", "Three.js"],
    shot: "/shots/gtav.jpg",
    url: "https://gtav-web-opal.vercel.app",
    repo: "https://github.com/SimonSaysGiveMeSmile/gtav-web",
  },
  {
    title: "The Backrooms",
    sub: "Online",
    blurb:
      "3D Backrooms exploration — five levels across 2 km² of procedural maps, eleven stealth-AI entities, and live multiplayer.",
    tags: ["Horror", "Multiplayer", "Three.js"],
    // Drop a real capture here to replace the placeholder automatically:
    shot: "/shots/backrooms.jpg",
    url: "https://backroom-gamma.vercel.app",
    repo: "https://github.com/SimonSaysGiveMeSmile/backroom",
  },
  {
    title: "F-22 Lightning II",
    sub: "1996 · DOS",
    blurb:
      "NovaLogic's 1996 combat flight simulator, preserved in the browser via DOSBox compiled to WebAssembly.",
    tags: ["Flight Sim", "DOS", "WASM"],
    // Drop a real capture here to replace the placeholder automatically:
    shot: "/shots/f22.jpg",
    url: "https://f22-lightning-web.vercel.app",
    repo: "https://github.com/SimonSaysGiveMeSmile/f22-lightning-web",
    upstream: {
      label: "js-dos — DOSBox in WebAssembly",
      url: "https://github.com/caiiiycuk/js-dos",
    },
    note: "Game © 1996 NovaLogic · preservation / educational use",
  },
];
