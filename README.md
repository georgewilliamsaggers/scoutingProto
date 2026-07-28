# fX AgOS AI — Field Scouting Prototype

Mobile-first web prototype for field scouting, built for Railway deployment.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **TypeScript**

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — best viewed in mobile device mode (430px width).

## Deploy to Railway

1. Push this repo to GitHub
2. Create a new Railway project and connect the repo
3. Railway will detect the `Dockerfile` and deploy automatically

The app uses Next.js standalone output for a lean production build.

## Prototype notes

- Login is simulated — any credentials work, or use **Try demo account**
- After sign-in, a placeholder home screen is shown for the next build phase
