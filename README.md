# TASA — Vercel Deployment Guide

## Stack
- **Frontend**: React + Vite + Tailwind CSS
- **API**: Vercel Serverless Functions (`/api/`)
- **Database**: Vercel Postgres (Neon)
- **File Storage**: Vercel Blob

---

## Deploy to Vercel (step by step)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "TASA initial"
gh repo create tasa --private --push
```
Or push to an existing repo.

### 2. Import on Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repo
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Click **Deploy**

### 3. Add Storage (Database)
- Vercel Dashboard → your project → **Storage** tab
- Click **Create Database** → choose **Postgres** (powered by Neon, free tier available)
- Connect it to your project — Vercel auto-adds all `POSTGRES_*` env vars

### 4. Add Storage (Blob)
- Vercel Dashboard → **Storage** tab
- Click **Create** → choose **Blob**
- Connect to your project — Vercel auto-adds `BLOB_READ_WRITE_TOKEN`

### 5. Redeploy
After adding storage, trigger a redeploy:
- Vercel Dashboard → Deployments → **Redeploy**

The DB table is auto-created on first form submission — no migrations needed.

### 6. Custom Domain (tasa.com)
- Vercel Dashboard → your project → **Settings** → **Domains**
- Add `tasa.com`
- Go to Hostinger DNS → update nameservers to Vercel's:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
- Or add a CNAME record if keeping Hostinger DNS:
  - `@` → `cname.vercel-dns.com`

SSL is automatic once DNS propagates (5–30 min).

---

## Local Dev
```bash
npm install
npm run dev
```
For local API testing, install [Vercel CLI](https://vercel.com/docs/cli):
```bash
npm i -g vercel
vercel dev
```
This runs both the Vite frontend and the serverless functions locally.
