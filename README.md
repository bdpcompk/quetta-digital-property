# Balochistan Property Portal (QDP)

Zameen.com-style real estate portal for Balochistan, Pakistan. Built with
Next.js 16 (App Router, static export) + TypeScript + Tailwind CSS v4 +
Framer Motion, with an optional Supabase backend and GitHub Pages deploy.

## Features

- Home: hero search, districts rail, featured properties, projects, QDA
  schemes, guides, agents, CTA
- `/listings/` — searchable/filterable grid (district, type, purpose, price)
- `/property/[id]/` — gallery, description, features, details, agent sidebar,
  similar properties
- `/qda/`, `/projects/`, `/areas/`, `/guides/`, `/agents/`, `/sell/`,
  `/contact/`
- Fully responsive (verified at 390px), reduced-motion friendly
- Supabase-first data access with bundled seed-data fallback — the site works
  with zero configuration

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # static export to out/
npm run lint
```

Copy `.env.local.example` to `.env.local` to connect Supabase. Run
`supabase/schema.sql` in the Supabase SQL editor first. Leave it empty to use
the bundled seed data.

## Deploy (GitHub Pages)

Push to `master` — `.github/workflows/deploy.yml` builds and publishes `out/`
via GitHub Actions.

- The workflow sets `NEXT_PUBLIC_BASE_PATH=/quetta-digital-property` for the
  project URL. Local builds leave it unset (site served from root).
- Optional repo secrets: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Repo Settings → Pages → Source must be **GitHub Actions**.

Live: https://stellarsagency.github.io/quetta-digital-property/
