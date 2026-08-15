# PMO Mastery — Dynamic Event Platform

A complete redesign of the [PMO Mastery](https://www.pmomastery.tn) website with a **fully dynamic back office**. The administrator can manage every piece of content (event, speakers, programme, passes, payment links, partners, organizers, contact info, CMS sections, media) from a secure dashboard — **no code changes required** for new editions.

## ✨ Highlights

- **Premium international-event aesthetic** — navy/violet/gold palette, Unbounded + Poppins typography, subtle animations.
- **Dynamic everything** — no hardcoded event dates, prices, speakers, or payment links. All from DB.
- **Live countdown** — pulls target date from DB, with `upcoming / live / ended` states.
- **Back office** — sidebar dashboard with CRUD for every entity, drag & drop ordering, image upload with sharp optimization.
- **Bilingual FR/EN** — DB columns `*Fr` / `*En` with cookie-based locale switcher.
- **Secure admin** — NextAuth credentials + bcrypt + JWT, protected `/admin/*` and `/api/admin/*` via middleware.
- **SEO-ready** — dynamic metadata, OpenGraph, JSON-LD, `sitemap.xml`, `robots.txt`.
- **Responsive** — mobile / tablet / desktop, public site + admin.
- **Migration-ready** — seed script imports the existing PMO Mastery 2025 content (21 speakers, 20 sessions, 5 passes, 7 partners, 1 organizer).

---

## 🧱 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router, RSC) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** + **shadcn/ui** (New York) |
| Database | **Prisma ORM** — SQLite in dev (switch to PostgreSQL in prod, see below) |
| Auth | **NextAuth.js v4** (Credentials provider, JWT, bcrypt) |
| i18n | DB columns (`titleFr` / `titleEn`) + cookie locale |
| Forms | react-hook-form + zod |
| Tables | @tanstack/react-table |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Image upload | sharp (WebP, max 1600px, 8MB limit) |
| Animations | framer-motion |
| Fonts | Poppins + Unbounded (Google Fonts) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and Bun
- A PostgreSQL database (production) — or use the bundled SQLite for development

### Installation

```bash
# 1. Install dependencies
bun install

# 2. Copy and configure environment
cp .env.example .env
# Edit .env: set NEXTAUTH_SECRET, ADMIN_SEED_PASSWORD, NEXT_PUBLIC_SITE_URL

# 3. Push database schema
bun run db:push

# 4. Seed with existing PMO Mastery content (21 speakers, 20 sessions, 5 passes, 7 partners…)
bun run db:seed

# 5. Start the dev server
bun run dev
```

Open:
- **Public site** → http://localhost:3000
- **Admin dashboard** → http://localhost:3000/admin
- **Default admin login** → `admin@pmomastery.tn` / `PMOmaster2025!` (change it immediately from Settings)

---

## 🔐 Environment Variables

```env
# Database (SQLite for dev)
DATABASE_URL=file:/home/z/my-project/db/custom.db

# For production with PostgreSQL, replace with:
# DATABASE_URL=postgresql://user:password@localhost:5432/pmomastery
# And change `provider = "sqlite"` to `provider = "postgresql"` in prisma/schema.prisma

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-random-string

# Default admin (used by the seed script)
ADMIN_SEED_EMAIL=admin@pmomastery.tn
ADMIN_SEED_PASSWORD=PMOmaster2025!

# Public site URL (for SEO / sitemap / OG)
NEXT_PUBLIC_SITE_URL=https://www.pmomastery.tn

# Default locale
NEXT_PUBLIC_DEFAULT_LOCALE=fr
```

Generate a strong `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## 🗄 Switching to PostgreSQL (Production)

The Prisma schema is portable. To switch:

1. Install PostgreSQL and create a database:
   ```bash
   createdb pmomastery
   ```
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/pmomastery
   ```
4. Push the schema and seed:
   ```bash
   bun run db:push
   bun run db:seed
   ```

All column types are SQLite-compatible (no SQLite-specific features used), so the migration is a one-line change.

---

## 📁 Project Structure

```
prisma/
  schema.prisma         — 14 models (Event, Speaker, ProgrammeDay, …)
  seed.ts               — imports existing PMO Mastery 2025 content

src/
  app/
    page.tsx            — public homepage (server component, cookie locale)
    layout.tsx          — root layout (fonts, metadata, toaster)
    globals.css         — Tailwind + PMO brand palette (violet/navy/gold)
    sitemap.ts          — dynamic sitemap
    robots.ts           — robots.txt
    admin/
      login/page.tsx    — public login page
      (dashboard)/      — protected admin route group
        layout.tsx      — sidebar + topbar shell
        page.tsx        — dashboard overview
        event/          — event editor (general, dates, location, media, status)
        speakers/       — list + new + [id] edit
        programme/      — days + sessions (drag & drop)
        passes/         — list + new + [id] edit (with payment URL)
        organizers/     — list + inline editor
        partners/       — list + inline editor (by category)
        content/        — CMS: Hero, Why Participate, About, Footer, Contact
        media/          — media library
        settings/       — change password
    api/
      auth/[...nextauth]/route.ts  — NextAuth handler
      upload/route.ts              — image upload (sharp optimization)
      admin/                       — all admin CRUD endpoints (protected)
      public/
        site/route.ts              — composite endpoint for the homepage
        contact/route.ts           — public contact form (zod validated)
  components/
    admin/              — sidebar, topbar, image-uploader, form-card, page-header
    public/
      header.tsx        — sticky nav with FR/EN toggle
      countdown.tsx     — live countdown (upcoming/live/ended states)
      speaker-modal.tsx — speaker detail dialog
      contact-form.tsx  — validated contact form
      sections/         — speakers-section, programme-section, passes-section
    ui/                 — shadcn/ui component library
  lib/
    auth.ts             — NextAuth options + bcrypt helpers
    api.ts              — JSON helpers + requireAdmin() + safeUrl()
    db.ts               — Prisma client singleton
    i18n.ts             — locale cookie helper
    uploads.ts          — sharp-based image optimization
    utils.ts            — cn, slugify, formatPrice, parseFeatures
  middleware.ts         — protects /admin/* routes

public/uploads/         — uploaded images (served statically)
```

---

## 🗃 Database Schema

14 models with proper relations:

| Model | Purpose |
|-------|---------|
| `AdminUser` | Authenticated admin (email, bcrypt hash, role) |
| `Event` | The active event (supports future editions: 2025, 2026, 2027…) |
| `Setting` | Key-value site config (reserved for future use) |
| `Speaker` | Intervenants (with FR/EN fields, photo, LinkedIn, featured flag) |
| `ProgrammeDay` | Programme days (Day 1 / Day 2 …) |
| `ProgrammeSession` | Sessions within a day (time, type, language, room, moderator) |
| `SessionSpeaker` | M2M between sessions and speakers |
| `Pass` | Tickets with price, VAT, features, **payment URL**, min quantity |
| `Organizer` | Organizing entities (with founder info) |
| `Partner` | Sponsors (categorized: Strategic, Diamond, Gold, Silver, Media, Institutional) |
| `WebsiteSection` | CMS sections (HERO, WHY_PARTICIPATE, ABOUT, FOOTER) |
| `Benefit` | Bullet points inside the "Why Participate" section |
| `ContactInfo` | Email, phone, address, social links |
| `MediaAsset` | Uploaded images (filename, mime, size, dimensions) |
| `ContactMessage` | Submissions from the public contact form |

---

## 🔌 API Reference

### Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/site` | Composite endpoint: active event + all related data |
| POST | `/api/public/contact` | Submit contact form (zod validated) |

### Admin APIs (all require authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET / POST | `/api/admin/event` | List / create event |
| PUT / DELETE | `/api/admin/event/[id]` | Update / delete event |
| GET / POST | `/api/admin/speakers` | List / create speaker |
| GET / PUT / DELETE | `/api/admin/speakers/[id]` | Read / update / delete speaker |
| GET / POST | `/api/admin/programme` | List programme / create day or session (`kind` in body) |
| PUT / DELETE | `/api/admin/programme/days/[id]` | Update / delete a day |
| PUT / DELETE | `/api/admin/programme/sessions/[id]` | Update / delete a session |
| GET / POST | `/api/admin/passes` | List / create pass |
| GET / PUT / DELETE | `/api/admin/passes/[id]` | Read / update / delete pass |
| GET / POST | `/api/admin/organizers` | List / create organizer |
| PUT / DELETE | `/api/admin/organizers/[id]` | Update / delete organizer |
| GET / POST | `/api/admin/partners` | List / create partner |
| PUT / DELETE | `/api/admin/partners/[id]` | Update / delete partner |
| POST | `/api/admin/content` | Upsert a CMS section + benefits |
| PUT | `/api/admin/contact` | Update contact info |
| DELETE | `/api/admin/media/[id]` | Delete a media asset |
| POST | `/api/upload` | Upload an image (sharp-optimized) |
| PUT | `/api/admin/account` | Change admin password |

---

## 🎨 Admin Workflow (Critical Rule)

The site is **100% dynamic**. To create a new edition (e.g. PMO Mastery 2026):

1. **Login** at `/admin` with `admin@pmomastery.tn` / `PMOmaster2025!`
2. Go to **Événement** → click "Nouvelle édition" → fill in title, dates, location → Save.
3. The new edition becomes "active". The previous one is automatically deactivated.
4. Go to **Speakers** → add/edit speakers (with photos, bios, social links).
5. Go to **Programme** → create Day 1 / Day 2 → add sessions (with drag & drop reordering).
6. Go to **Passes** → set prices, features, and **the payment URL for each pass**.
7. Go to **Organizers** / **Partners** → manage logos, categories, social links.
8. Go to **Content** → edit Hero, Why Participate, About, Footer, Contact.
9. The **public site updates automatically** — no developer needed.

---

## 🔐 Security

- **Password hashing** — bcrypt with 10 rounds
- **JWT sessions** — 8-hour expiry, signed with `NEXTAUTH_SECRET`
- **Protected routes** — `middleware.ts` guards `/admin/*` server-side
- **Protected APIs** — `requireAdmin()` checks session on every `/api/admin/*` endpoint
- **URL validation** — payment URLs are validated with `safeUrl()` (http/https only)
- **File upload validation** — mime type allowlist (jpeg/png/webp/gif/avif), 8 MB max
- **Image optimization** — sharp re-encodes to WebP, max 1600px wide
- **Input validation** — zod on contact form, Prisma type safety on all admin writes
- **No secrets in client** — `ADMIN_SEED_PASSWORD` only used server-side in the seed script

---

## 📊 Migration Notes

The seed script (`prisma/seed.ts`) imports the existing PMO Mastery 2025 content:

- **21 speakers** with FR/EN bios, photos (referenced from `pmomastery.tn`), LinkedIn URLs, featured flags
- **2 programme days** + **20 sessions** (Day 1 = training, Day 2 = main event)
- **5 passes** with their `businessroom.io/?ticket_id=XXX` payment URLs
- **7 partners** with categories (Strategic, Diamond, Media, Partner)
- **1 organizer** (Empowerment Paths + Yosra Torjmen, founder credentials)
- **4 CMS sections** (Hero, Why Participate with 5 benefits, About, Footer)
- **Contact info** (email, phone, address, LinkedIn, Facebook, Instagram)

Image URLs currently point to `https://www.pmomastery.tn/assets/...` so the new site renders identically. To localize them, use the **Médiathèque** in the admin to upload copies, then update each entity's image field.

---

## 🚢 Production Deployment

### Build

```bash
bun run build
```

### Deploy to Vercel / Netlify / Docker

1. Set all environment variables in your hosting dashboard.
2. Switch Prisma to PostgreSQL (see section above).
3. Run `bun run db:push` once against your production DB.
4. Run `bun run db:seed` to create the admin user and initial content.
5. **Immediately change the admin password** from `/admin/settings`.
6. Configure your CDN to cache `/uploads/*` aggressively.

### Recommendations

- Use **Cloudflare** in front of the app for DDoS protection + CDN (the original site used Imperva, which blocked crawlers).
- Configure **Google Analytics 4** by adding the GA tag to `src/app/layout.tsx`.
- Set up **email delivery** for the contact form (currently stored in DB — queryable from admin).
- Use **S3 / Cloudinary** for media storage in production by swapping `src/lib/uploads.ts`.

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (port 3000) |
| `bun run build` | Production build |
| `bun run lint` | ESLint check |
| `bun run db:push` | Push schema changes to DB |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:migrate` | Create a migration |
| `bun run db:reset` | Reset DB (destructive!) |
| `bun run db:seed` | Seed with PMO Mastery 2025 content |

---

## 📝 License

© PMO Mastery — Empowerment Paths. All rights reserved.

Built for the international PMO conference, Tunis.
