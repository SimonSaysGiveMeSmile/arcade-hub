// ───────────────────────────────────────────────────────────────
// EDIT ME: add each game's deployed URL in `url`.
// Leave url:"" to show the game as "local / not deployed yet".
// `path` is the project folder under Games/ (for reference).
// `c` is the cabinet's signal color — drives the screen glow, the
//   light it spills into the dark hall, and its play button.
// `flagship:true` makes a cabinet the spotlit, always-on centerpiece.
// `spec` is one real engineering fact (not a generic tech pill).
// `src` is the source repo (omit if there isn't a public one).
// ───────────────────────────────────────────────────────────────
export const GAMES = [
  {
    title: "F-22 Lightning II",
    year: "1996 · DOS",
    scene: "f22",
    ico: "✈️",
    c: "#39d0d8",
    desc: "NovaLogic's combat flight simulator, running in-browser via DOSBox compiled to WebAssembly.",
    spec: "JS-DOS · DOSBOX · WASM",
    tech: ["js-dos", "DOSBox", "WASM"],
    path: "f22-lightning-web",
    url: "https://f22-lightning-web.vercel.app",
    src: "https://github.com/SimonSaysGiveMeSmile/f22-lightning-web",
  },
  {
    title: "Founder Simulator — GTA 6",
    year: "Open World",
    scene: "gta6",
    ico: "🏙️",
    c: "#ff5cb8",
    desc: "A stylized neon city you can roam — player movement, vehicles, NPCs and a live HUD.",
    spec: "THREE.JS · R3F · LIVE NPCS",
    tech: ["React", "Three.js", "R3F", "Vite"],
    path: "gta6",
    url: "https://gta6-beta.vercel.app",
  },
  {
    title: "Founder Simulator",
    year: "WebGPU",
    scene: "gtav",
    ico: "🌆",
    c: "#9b8cff",
    desc: "A clean-room, browser-only open-world prototype rendered with WebGPU.",
    spec: "WEBGPU · CLEAN-ROOM ENGINE",
    tech: ["React", "Three.js", "WebGPU", "Vite"],
    path: "gtav-web",
    url: "https://gtav-web-opal.vercel.app",
    src: "https://github.com/SimonSaysGiveMeSmile/gtav-web",
  },
  {
    title: "The Backrooms Online",
    year: "Multiplayer",
    scene: "backrooms",
    ico: "🚪",
    c: "#e8d44d",
    desc: "3D Backrooms exploration — 5 levels, 2km² procedural maps, 11 stealth-AI entity types, live multiplayer.",
    spec: "5 LEVELS · 2KM² · 11 ENTITIES",
    tech: ["Three.js", "Node server", "Socket.io"],
    path: "backroom",
    url: "https://backroom-gamma.vercel.app",
    src: "https://github.com/SimonSaysGiveMeSmile/backroom",
  },
  {
    title: "Minecraft Web — Word Builder",
    year: "Voxel Sandbox",
    scene: "minecraft",
    ico: "⛏️",
    c: "#a4d83c",
    desc: "Minecraft in your browser — press B, describe anything ('a giant glass castle'), and watch it built block-by-block in front of you.",
    spec: "DESCRIBE IT → BUILT IN VOXELS",
    tech: ["Three.js", "TypeScript", "Vite"],
    path: "minecraft-web",
    url: "https://minecraft-web-phi.vercel.app",
    src: "https://github.com/SimonSaysGiveMeSmile/minecraft-web",
  },
  {
    title: "SCP-3008: The Infinite IKEA",
    year: "Survival Horror",
    scene: "scp",
    ico: "🛋️",
    c: "#46c8ff",
    flagship: true,
    desc: "Multiplayer survival horror in an endless, procedurally-generated IKEA. Find other survivors, build a shelter, and don't stay past closing — the staff come out when the lights go down.",
    spec: "MULTIPLAYER · PROCEDURAL IKEA",
    tech: ["Three.js", "Node server", "Socket.io"],
    path: "SCP3008",
    url: "https://scp3008.vercel.app",
    src: "https://github.com/SimonSaysGiveMeSmile/SCP3008",
  },
];
