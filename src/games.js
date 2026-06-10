// ───────────────────────────────────────────────────────────────
// EDIT ME: add each game's deployed URL in `url`.
// Leave url:"" to show the game as "local / not deployed yet".
// `path` is the project folder under Games/ (for reference).
// ───────────────────────────────────────────────────────────────
export const GAMES = [
  {
    title: "F-22 Lightning II",
    year: "1996 · DOS",
    ico: "✈️",
    c: "#39d0d8",
    desc: "NovaLogic's combat flight simulator, running in-browser via DOSBox compiled to WebAssembly.",
    tech: ["js-dos", "DOSBox", "WASM"],
    path: "f22-lightning-web",
    url: "https://f22-lightning-web.vercel.app",
  },
  {
    title: "Founder Simulator — GTA 6",
    year: "Open World",
    ico: "🏙️",
    c: "#ff5cb8",
    desc: "A stylized neon city you can roam — player movement, vehicles, NPCs and a live HUD.",
    tech: ["React", "Three.js", "R3F", "Vite"],
    path: "gta6",
    url: "https://gta6-beta.vercel.app",
  },
  {
    title: "Founder Simulator",
    year: "WebGPU",
    ico: "🌆",
    c: "#9b8cff",
    desc: "A clean-room, browser-only open-world prototype rendered with WebGPU.",
    tech: ["React", "Three.js", "WebGPU", "Vite"],
    path: "gtav-web",
    url: "https://gtav-web-opal.vercel.app",
  },
  {
    title: "The Backrooms Online",
    year: "Multiplayer",
    ico: "🚪",
    c: "#e8d44d",
    desc: "3D Backrooms exploration — 5 levels, 2km² procedural maps, 11 stealth-AI entity types.",
    tech: ["Three.js", "Node server", "Socket.io"],
    path: "backroom",
    url: "https://backroom-gamma.vercel.app",
  },
  {
    title: "SCP-3008: The Infinite IKEA",
    year: "Survival Horror",
    ico: "🛋️",
    c: "#5cff9b",
    desc: "Multiplayer survival horror in an endless, procedurally-generated IKEA. Don't stay past closing.",
    tech: ["Three.js", "Node server", "Socket.io"],
    path: "SCP3008",
    url: "https://scp3008.vercel.app",
  },
];
