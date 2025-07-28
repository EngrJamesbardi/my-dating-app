# Modern Dating Web Application Monorepo

## Overview
A full-stack, cloud-ready dating app with Next.js frontend, Express backend, PostgreSQL, MongoDB, Socket.io, JWT, Google OAuth, and cloud media storage.

## Structure
- `src/` (Next.js frontend)
- `backend/` (Express backend)
- `shared/` (shared types/interfaces)
- `infrastructure/` (infra-as-code, cloud setup)
- `scripts/` (automation, migration, etc.)
- `.github/` (Copilot instructions, workflows)
- `.vscode/` (VS Code tasks/config)

## Features
- Secure authentication (email, Google OAuth)
- Profile creation, photo uploads, bio, interests, preferences
- Swipe/match interface with animations
- Location-based matching, smart recommendations
- Real-time chat, media sharing, notifications
- Admin dashboard, analytics, moderation
- Cloud media storage, geolocation, system health

## Getting Started
1. Install dependencies: `npm install`
2. Start frontend: `npm run dev`
3. Start backend: `cd backend && npm run dev`
4. Run tests: `npm test`
5. Configure environment variables in `.env`

## Deployment
- See `.github/workflows/ci-cd.yml` for CI/CD setup
- Customize deploy step for AWS/GCP

## Documentation
- API endpoints: see backend `src/` files
- Shared types: see `shared/types.ts`
- Infrastructure: see `infrastructure/`

## License & Privacy
- Add privacy policy and terms before launch

---
For more details, see code comments and scripts in each folder.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
