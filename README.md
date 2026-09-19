# Saafnikk

> vikas bhi, prakriti bhi — a community platform for clean-up & plantation drives across India.

A full-stack Next.js 14 app: drives (location-based, all-India), report-a-dirty-spot,
reels feed, profiles with followers, notifications, a wallet/revenue portal, and an
admin panel. Database via Prisma (SQLite locally, Postgres in production). Auth via
NextAuth (email + password).

## 1. Run it locally

Requires Node.js 18+.

```bash
cd clean-circle
npm install
cp .env.example .env          # then edit .env — at minimum set NEXTAUTH_SECRET
npm run db:push               # creates dev.db and the schema
npm run db:seed               # optional: adds a demo admin + sample drives
npm run dev
```

Open http://localhost:3000.

Demo logins after seeding:
- Admin — `admin@saafnikk.in` / `Saafnikk123!`
- Drive leader — `leader@saafnikk.in` / `Saafnikk123!`

Generate a real `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

## 2. What's built

- **Auth** — email/password signup & login (NextAuth + bcrypt), roles: USER,
  DRIVE_LEADER, SCHOOL_ADMIN, ADMIN.
- **Drives** — create a clean-up/plantation/awareness/recycling drive with a
  location, date, capacity; browse all drives or filter by "near me" (uses the
  browser's geolocation + a Haversine radius search — works anywhere in India).
- **Report a dirty spot** — photo + GPS location + description; admins can move a
  report through Open → Drive scheduled → Resolved, and link it to a drive.
- **Reels** — upload short videos/photos of clean-ups and plantations, like them,
  view by profile.
- **Profiles** — bio, city, institution (for school/college committees), follower/
  following counts, points earned from completed drives.
- **Notifications** — new followers, someone joining your drive, likes, report
  status changes.
- **Wallet** — balance + transaction history + withdrawal requests (queued as
  `PENDING` — see "Payments" below for going live).
- **Admin panel** — manage user roles, change drive status (completing a drive
  auto-awards participants points), triage reports.

## 3. Before this is truly production-ready

Two things are intentionally stubbed because they need *your* credentials —
they're marked clearly in the code:

**File uploads** (`src/app/api/upload/route.ts`) currently save to local disk
under `/public/uploads`. This works for local dev but most hosts (including
Vercel) have a read-only/ephemeral filesystem, so uploads would vanish. Swap
the handler's body for an upload to S3, Cloudinary, or Supabase Storage —
each has a simple Node SDK — and return that URL instead.

**Wallet payouts** (`src/app/api/wallet/route.ts`) records withdrawal
requests as `PENDING`. Actually paying someone requires a payment gateway
(Razorpay is the common choice for INR payouts, or Stripe Connect). Wire the
provider's payout API into that route, and flip the transaction to
`COMPLETED` once it succeeds.

Everything else — auth, database, the rest of the API, all pages — runs as-is.

## 4. Deploying

**Recommended stack:** Vercel (hosting) + Neon or Supabase (Postgres) +
Cloudinary (media).

1. Push this project to a GitHub repo.
2. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Create a free Postgres database (e.g. [neon.tech](https://neon.tech)) and
   copy its connection string.
4. Import the repo into [vercel.com](https://vercel.com). Add environment
   variables in the Vercel project settings:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — from `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your production URL (e.g. `https://clean-circle.vercel.app`)
5. Deploy. On first deploy, run `npx prisma db push` against the production
   `DATABASE_URL` (Vercel's build step or a one-off local run both work) to
   create the tables.
6. Wire up the file-upload and payout stubs described above using your own
   Cloudinary/S3 and Razorpay/Stripe credentials.

## 5. Project structure

```
src/app/            pages (App Router) + API routes under app/api/*
src/components/      NavBar, session provider
src/lib/             prisma client, auth config, geo helpers, admin guard
prisma/schema.prisma database schema
prisma/seed.ts       demo data
```

## 6. Known limits of this scaffold

- Comments on reels have a data model + API is not yet wired to a UI (easy to
  add — the `Comment` model and reel relation already exist).
- Sponsorship creation has a data model but no dedicated UI yet — sponsorships
  can be created directly via Prisma Studio (`npm run db:studio`) or a new API
  route following the same pattern as `drives`.
- No automated tests included.
- Rate limiting / abuse prevention (e.g. on report or reel submission) is not
  implemented — add before opening this up publicly at scale.
