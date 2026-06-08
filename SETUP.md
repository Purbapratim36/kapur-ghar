# Kapur Ghar — Setup & Operation Guide

## Why the "Your store is ready" banner shows up

The home page queries the database for products. Right now the DB is empty (no products created yet), so the home page shows a CTA telling you to add some. **It will disappear automatically once any product exists.**

This is intentional — it's better than showing dummy placeholder items that look broken.

---

## How to access the Admin Dashboard

1. Make sure dev server is running: `npm run dev`
2. Open http://localhost:3000/login
3. Sign in with the admin account that the seed script created:
   - **Email:** `purba_ug_24@ee.nits.ac.in`
   - **Password:** `KapurGhar@2026`
4. Once signed in, click the **user icon** in the top-right corner → **Admin Panel** appears in the dropdown
5. Or go directly: http://localhost:3000/admin

If you forgot the admin password, reset it by running:

```powershell
$env:ADMIN_EMAIL="your@email.com"
$env:ADMIN_PASSWORD="YourNewPassword"
npx tsx prisma/seed.ts
```

The seed script does an `upsert`, so it updates the password on existing admin accounts.

To promote any other registered user to admin: `npm run db:studio` → User table → change `role` from `USER` to `ADMIN`.

---

## First-time setup (already done for you)

```powershell
npm install
npx prisma generate
npx prisma db push
$env:ADMIN_EMAIL="purba_ug_24@ee.nits.ac.in"
$env:ADMIN_PASSWORD="KapurGhar@2026"
npx tsx prisma/seed.ts
```

This creates the SQLite database (`prisma/dev.db`), seeds 11 categories, a `KAPURGHAR20` coupon, and your admin account.

---

## Running the app

```powershell
npm run dev
```

http://localhost:3000

If port 3000 is taken: `taskkill /F /IM node.exe` then re-run.

---

## Adding products

**Option 1 — Admin UI (recommended):**
1. Sign in as admin
2. `/admin/products` → **Add Product**
3. Fill form, paste image URLs (Cloudinary / Unsplash / any public URL), pick a category, save

**Option 2 — Prisma Studio (visual DB editor):**
```powershell
npm run db:studio
```
Opens http://localhost:5555. Edit any table directly.

**Option 3 — Seed script (bulk):**
Edit `prisma/seed.ts`, add product entries, run `npx tsx prisma/seed.ts`.

---

## Deploying to Netlify

> SQLite cannot run on Netlify (the filesystem is read-only/ephemeral on Netlify Functions). You must use a hosted Postgres database in production.

### Step 1 — Get a free Postgres database

Pick one (all have free tiers):
- **Neon** — https://neon.tech (recommended, fastest setup)
- **Supabase** — https://supabase.com
- **Vercel Postgres** — https://vercel.com/storage

Copy the connection string. It looks like:
```
postgresql://user:pass@host/dbname?sslmode=require
```

### Step 2 — Switch Prisma to Postgres

Open `prisma/schema.prisma` and change:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 3 — Push schema to your new Postgres

```powershell
$env:DATABASE_URL="postgresql://your-connection-string-here"
npx prisma db push
$env:ADMIN_EMAIL="purba_ug_24@ee.nits.ac.in"
$env:ADMIN_PASSWORD="KapurGhar@2026"
npx tsx prisma/seed.ts
```

### Step 4 — Push code to GitHub

```powershell
git init
git add -A
git commit -m "Initial Kapur Ghar e-commerce build"
gh repo create kapur-ghar --private --source=. --push
```

### Step 5 — Connect to Netlify

1. Go to https://app.netlify.com → **Add new site** → **Import existing project**
2. Connect GitHub, pick the repo
3. Netlify auto-detects Next.js from `netlify.toml`. Build settings:
   - Build command: `npx prisma generate && npm run build`
   - Publish directory: `.next`
4. Click **Show advanced** → **Add environment variables**, paste:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | your Postgres connection string |
| `AUTH_SECRET` | run `openssl rand -base64 32` to generate |
| `NEXTAUTH_SECRET` | same value as AUTH_SECRET |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | `https://your-site.netlify.app` |
| `NEXTAUTH_URL` | `https://your-site.netlify.app` |
| `NEXT_PUBLIC_APP_URL` | `https://your-site.netlify.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919876543210` |

Optional (if you've set them up):
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_*`
- `RAZORPAY_*`
- `SMTP_*`

5. **Deploy site**

### Step 6 — Update Google OAuth callback (if using Google)

In Google Cloud Console, add the new redirect URI:
```
https://your-site.netlify.app/api/auth/callback/google
```

---

## Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:push` | Sync schema to DB |
| `npm run db:seed` | Seed categories + coupon (set ADMIN_EMAIL/PASSWORD env vars to also create an admin) |
| `npm run db:studio` | Visual DB editor on :5555 |
| `npm run db:reset` | Wipe DB and reseed |

---

## Troubleshooting

**"Authentication not working" / can't log in**
- Make sure `.env` has `AUTH_SECRET` and `NEXTAUTH_SECRET` set to the same value
- Restart dev server after editing `.env`
- If you registered a new user but can't log in, check Prisma Studio (User table) — they should be there with a password hash

**"Configuration" error in NextAuth**
- Usually means `AUTH_SECRET` is missing. Check `.env`.
- For Netlify: confirm you set both `AUTH_SECRET` and `NEXTAUTH_SECRET` in environment variables

**Admin panel redirects to login forever**
- You're signed in but the user's role isn't `ADMIN`. Open Prisma Studio, find your User, change role to `ADMIN`.

**Google sign-in fails**
- Verify the redirect URI in Google Cloud Console matches exactly (no trailing slash)
- Production: it must be `https://your-domain/api/auth/callback/google`
