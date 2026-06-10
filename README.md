# The Arcade — game hub

A **React + Vite** landing page that links to every game in this `Games/` workspace.
Vercel auto-detects Vite and builds it (`dist/`).

## Develop / build

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview   # serve the production build
```

## Adding / updating links

Open `src/games.js` and edit the `GAMES` array:

```js
{
  title: "F-22 Lightning II",
  ...
  path: "f22-lightning-web",          // folder under Games/
  url: "https://your-game.vercel.app" // ← paste the deployed URL here
}
```

- `url: ""` → the card shows as **Local / Not deployed**.
- A non-empty `url` → the card flips to **Live** and the Play button links to it.

## Deploy the hub

```bash
cd hub
vercel --prod
```

## Deploy the individual games

Each game is its own project with its own `vercel.json`:

```bash
cd ../f22-lightning-web && vercel --prod
cd ../gta6             && vercel --prod
cd ../gtav-web         && vercel --prod
cd ../backroom         && vercel --prod   # full-stack (client + server)
cd ../SCP3008          && vercel --prod   # full-stack (client + server)
```

Then copy each deployment URL back into `hub/src/games.js` → `GAMES[].url`.
