# Datalab — Dawn News Intelligence Platform

Full-stack news intelligence platform: scrapes Dawn.com, stores articles in Supabase, and displays them through a branded React dashboard.

## Architecture

- **Scraper** — Python, runs on GitHub Actions (hourly RSS + daily sequential)
- **Storage** — Supabase (Postgres + REST API)
- **Frontend** — React 18 + TypeScript + Tailwind + Recharts, deployed to Vercel

## Setup

### 1. Supabase

1. Create a Supabase project
2. Run migrations in order:
   ```
   supabase/migrations/001_schema.sql
   supabase/migrations/002_functions.sql
   supabase/migrations/003_rls.sql
   ```
3. Note your **Project URL** and **service_role key** (for scraper) + **anon key** (for frontend)

### 2. GitHub Secrets

Add to your repo → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (has write access) |

### 3. Frontend (Vercel)

```bash
cd frontend
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Deploy to Vercel: connect the repo, set root to `frontend/`, add env vars.

### 4. Seed the sequential checkpoint (optional)

Edit `supabase/seed.sql` to set a starting Dawn article ID, then run it via the Supabase SQL editor.

## Workflows

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| `dawn_rss.yml` | Every hour | Scrapes 5 Dawn RSS feeds |
| `dawn_sequential.yml` | Daily 03:00 UTC | Fills ID gaps sequentially |

Both can be triggered manually from the GitHub Actions UI.

## Frontend Pages

| Route | Page |
|-------|------|
| `/` | Overview — metrics, charts, last run |
| `/runs` | Run Log — filterable scrape history |
| `/articles` | Articles — searchable archive |
| `/sections` | By Section — distribution charts + table |
| `/checkpoints` | Checkpoints — scraper state + ID coverage |
