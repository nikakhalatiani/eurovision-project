# Eurovision Project

A React, TypeScript, and Vite voting companion for Eurovision 2026. The app lets users rank countries, lock a top 10, replay saved votes after refresh, and view the 2026 visual identity with an animated canvas background.

## Routes

- `/` - landing page with the Eurovision 2026 branding and countdown.
- `/app` - test voting flow with all 2026 participants.
- `/rapp` - real voting flow that changes by semifinal/final schedule.

The app is configured for GitHub Pages under `/eurovision-project/`.

## Local Development

```bash
npm install
npm run dev
```

Vite usually serves the app at:

```text
http://127.0.0.1:5174/eurovision-project/
```

## Production Build

```bash
npm run lint
npm run build
```

The production build is written to `dist/`.

## Deploy

```bash
npm run deploy
```

Deployment uses `gh-pages -d dist`, so GitHub Pages should be configured to serve:

```text
Branch: gh-pages
Folder: /root
```

## Important Files

- `src/contestants2026.ts` - 2026 participant, semifinal, finalist, and result data.
- `src/eurovisionSchedule.ts` - schedule gates for the real voting flow.
- `src/RApp.tsx` - real voting flow and vote persistence.
- `src/App.tsx` - routing and the test voting flow.
- `src/Background.tsx` - canvas-rendered Eurovision background.
- `public/brand/` - Eurovision logo and visual assets used by the frontend.

## Vote Persistence

The real voting flow stores the current state in `localStorage`:

- `RealcountryItems` - current editable order before locking.
- `userTopTen` - locked semifinal top 10.
- `userFinal` - locked final ranking.
- `Realsubmitted` - whether the active phase is locked.

Locked semifinal reloads restore from `userTopTen`, so the page remains locked to 10 countries after refresh.
