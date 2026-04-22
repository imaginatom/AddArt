# Noun Studio — Technical README

This document is written for automated ingestion (e.g. another AI or senior engineer onboarding). It describes the **Noun Studio** marketing site and CMS: a French (`fr-DZ`) public website for an architecture and branding studio (Oran, Algeria), backed by **Supabase** (Auth, Postgres content, Storage) and **Next.js App Router**.

---

## 1. Project overview

**What it is:** A multi-page promotional website for **Noun Studio** — positioned as a multidisciplinary architecture practice and design studio (architecture, visual identity / branding, cultural content). The product name in UI and metadata is **Noun Studio**; founder / creative lead **SAHNOUNE Mohammed** appears in structured data and contact copy.

**Who it is for:** Prospective clients seeking residential/commercial architecture, renovation, visual identity, and related services in **Algeria and France** (copy emphasizes **Oran** and local SEO).

**What it does:**

- **Public site:** Home, service pillars (Architecture, Branding), portfolio (`/realisations`), contact with FAQ, SEO metadata, `sitemap.xml`, `robots.txt`, JSON-LD (`Architect` schema).
- **CMS:** Authenticated **admin** area (`/admin/*`) where staff with `profiles.role = 'admin'` edit structured JSON content stored in `site_content`, and upload images to Supabase Storage bucket `site-images`.
- **Content resolution:** Server components fetch `site_content` and **merge** DB rows with **TypeScript defaults** in `lib/content/*.ts` so missing rows still render sensible copy and images.

---

## 2. Tech stack (with versions)

Versions below reflect **`package.json` ranges** where applicable; **installed** patch versions are from `npm list --depth=0` (lockfile may pin further).

| Layer | Technology | Version (declared / resolved where noted) |
|--------|------------|---------------------------------------------|
| Runtime | Node (implied by Next 16) | — |
| Framework | **Next.js** | `16.1.6` |
| UI library | **React** | `^19` / installed `19.2.4` |
| Language | **TypeScript** | `5.7.3` |
| Styling | **Tailwind CSS** | `^3.4.17` / installed `3.4.19` |
| PostCSS | **PostCSS** | `^8.5` / installed `8.5.6` |
| Tailwind PostCSS bridge | **@tailwindcss/postcss** | `^4.1.13` / installed `4.1.18` |
| CSS animation | **tailwindcss-animate** | `^1.0.7` |
| Component primitives | **Radix UI** (`@radix-ui/react-*`) | Various pinned (e.g. accordion `1.2.2`, dialog `1.1.4`) |
| Icons | **lucide-react** | `^0.544.0` |
| Class utilities | **clsx**, **tailwind-merge**, **class-variance-authority** | Per `package.json` |
| Forms / validation | **react-hook-form**, **@hookform/resolvers**, **zod** | Per `package.json` |
| Backend / auth | **@supabase/supabase-js** | `^2.95.3` |
| SSR cookies | **@supabase/ssr** | `^0.8.0` |
| Theming (component present) | **next-themes** | `^0.4.6` (wrapper in `components/theme-provider.tsx`; **not wired in root layout**) |
| Toasts | **sonner** | `^1.7.1` |
| Charts (UI kit) | **recharts** | `2.15.0` |
| Carousel | **embla-carousel-react** | `8.5.1` |
| Date UI | **react-day-picker** | `^9.13.2` |
| Drawer | **vaul** | `^1.1.2` |
| Command palette | **cmdk** | `1.1.1` |
| OTP input | **input-otp** | `1.4.1` |
| Resizable panels | **react-resizable-panels** | `^2.1.7` |
| Dates | **date-fns** | `^3.6.0` |
| Fonts | **next/font/google** — DM Sans, Playfair Display | (bundled with Next) |
| Sitemap (dependency) | **next-sitemap** | `^4.2.3` — **installed but no `postbuild` script or config file**; app uses native **`app/sitemap.ts`** instead |

**Build / tooling:**

- **`next.config.mjs`:** `typescript.ignoreBuildErrors: true` (TypeScript errors do not fail production build). `images.unoptimized: true` (Next Image serves without default optimization pipeline).
- **`npm run lint`:** runs `eslint .` but **eslint is not listed in `devDependencies`** — lint setup may be incomplete unless ESLint is provided globally or via another mechanism.
- **shadcn/ui:** `components.json` indicates **style default**, **RSC**, **neutral** base, aliases under `@/components`, `@/lib`, `@/hooks`.

---

## 3. Project structure

Repository root (`noun/`):

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router: layouts, pages, `globals.css`, metadata routes |
| `app/layout.tsx` | Root layout: fonts, global shell (header, footer, floating CTA, back-to-top, scroll animations), JSON-LD, **no** ThemeProvider |
| `app/page.tsx` | Home — loads `site_content` for `page=home` + portfolio gallery slice for preview |
| `app/architecture/page.tsx` | Architecture service page from DB `page=architecture` |
| `app/branding/page.tsx` | Branding service page from DB `page=branding` |
| `app/realisations/page.tsx` | Portfolio / réalisations from DB `page=portfolio` |
| `app/contact/page.tsx` | Static contact page + `ContactForm` + FAQ (not CMS-driven) |
| `app/sitemap.ts` | `MetadataRoute.Sitemap` for `https://nounstudio.dz` |
| `app/robots.ts` | Allows all crawlers; points sitemap to production URL |
| `app/admin/layout.tsx` | Admin chrome: `AdminNav` only |
| `app/admin/page.tsx` | Admin dashboard (client): aggregates `site_content` counts per page |
| `app/admin/login/page.tsx` | Email/password sign-in; requires `profiles.role === 'admin'` |
| `app/admin/homepage/page.tsx` | CMS editor for home sections |
| `app/admin/portfolio/page.tsx` | CMS editor for portfolio sections |
| `app/admin/architecture/page.tsx` | CMS editor for architecture sections |
| `app/admin/branding/page.tsx` | CMS editor for branding sections |
| `components/` | Shared React components (marketing + admin) |
| `components/ui/` | shadcn-style primitives (Radix + Tailwind) |
| `components/home/` | Home-only sections (hero, services, testimonials, etc.) |
| `components/admin/` | `AdminNav`, `ImageUpload`, `LogoutButton` |
| `hooks/` | `use-mobile`, `use-scroll-animation`, `use-toast` (duplicated filename under `components/ui/` for some shadcn patterns) |
| `lib/content/` | Default content + `merge*` functions: `homepage`, `portfolio`, `architecture`, `branding` |
| `lib/supabase/` | `env.ts`, browser `client.ts`, server `server.ts` |
| `lib/utils.ts` | `cn()` (clsx + tailwind-merge) |
| `middleware.ts` | Protects `/admin/*` except login; enforces auth + admin role |
| `supabase/migrations/` | SQL: `profiles`, `site_content`, RLS, triggers; storage bucket policies |
| `supabase/seed.sql` | Idempotent inserts for default `home` rows |
| `public/` | (standard Next static assets; referenced paths like `/images/*.jpg`) |
| `styles/globals.css` | **Legacy / alternate** Tailwind entry with Arial body font — **not** imported by `app/layout.tsx` (active styles are `app/globals.css`) |
| `components.json` | shadcn configuration |
| `tailwind.config.ts` | Tailwind theme extensions |
| `postcss.config.mjs` | PostCSS: `tailwindcss` plugin only |
| `tsconfig.json` | Strict TS, `@/*` paths, Next plugin |
| `next.config.mjs` | Next configuration |
| `next-env.d.ts` | Next/TS declarations |
| `.env.local` | Local secrets (gitignored) |
| `.gitignore` | Ignores `.next`, `node_modules`, `.env*.local`, etc. |
| `.cursorrules` | Editor/agent rules (project-specific) |
| `.vscode/settings.json` | Workspace editor settings |

**Note:** `package.json` **name** is still `"my-project"` (template artifact).

---

## 4. Key features

**Public marketing**

- Responsive layout with fixed header (transparent on home until scroll), mobile sheet nav, footer.
- Home: hero (optional background image from CMS), stats bar, services grid, why-us (image + benefits), testimonials carousel/grid, portfolio preview (first 6 projects from merged portfolio content), local SEO block (Oran), contact CTA.
- Architecture & Branding: hero with full-bleed image, intro, alternating service blocks with features and images, process steps (architecture only), primary CTA + embedded contact form, cross-links to sibling pages / portfolio.
- Portfolio: filterable masonry-style gallery with lightbox (`RealisationsGallery`), bottom CTA + mailto.
- Contact: bilingual French copy, team names, FAQ accordion, **client-only** contact form UX.
- SEO: per-page `metadata`, Open Graph, Twitter card, canonical base `https://nounstudio.dz`, JSON-LD `Architect`.
- UX: floating mail CTA (mobile, after scroll), back-to-top, scroll-triggered animations (`useScrollAnimation`).

**CMS / admin**

- Supabase Auth **email/password** login at `/admin/login`.
- Middleware + login page both require **`profiles.role === 'admin'`**; non-admins are signed out and redirected to `/`.
- Dashboard shows section counts and latest `updated_at` per logical page (`home`, `portfolio`, `architecture`, `branding`).
- Per-section editors: load `site_content`, edit in React state, **save** = insert or update row by `(page, section)` with `content_type: 'text'` and JSON `content`.
- **ImageUpload:** uploads to Storage bucket `site-images`, stores public URL + path in JSON for hero/service images; remove deletes object when `path` known.

**Data**

- Single flexible table `site_content` keyed by `page` + `section` with JSONB `content`.
- Fallback **defaults** in TS ensure rendering if DB empty or partial.

**Not implemented / stubbed**

- **Contact form** does not POST to an API or email service — it **simulates** delay and shows success (`components/contact-form.tsx`).
- **ThemeProvider** exists but is **not** used in `app/layout.tsx`.
- **`next-sitemap`** package unused in favor of `app/sitemap.ts`.

---

## 5. Database schema (Supabase / PostgreSQL)

### 5.1 `auth.users` (Supabase managed)

Standard Supabase Auth table. **`public.profiles.id`** is a foreign key to `auth.users(id)`.

### 5.2 `public.profiles`

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | PK, **FK** → `auth.users(id)` `ON DELETE CASCADE` |
| `role` | `text` | `NOT NULL`, default `'user'`, **CHECK** `IN ('user','admin')` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()`, maintained by trigger `set_profiles_updated_at` → `set_updated_at()` |

**RLS:** Enabled.

- **SELECT / INSERT / UPDATE:** own row (`auth.uid() = id`).
- **DELETE:** `public.is_admin()` only.

**Function `public.is_admin()`:** `SECURITY DEFINER`, returns true if a `profiles` row exists for `auth.uid()` with `role = 'admin'`. Used in policies for `site_content` and storage.

### 5.3 `public.site_content`

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `page` | `text` | Logical page key: e.g. `home`, `portfolio`, `architecture`, `branding` |
| `section` | `text` | Section key within page (e.g. `hero`, `gallery`, `services`) |
| `content_type` | `text` | **CHECK** `IN ('text','image','list')` — app currently writes **`'text'`** for all CMS saves while storing structured JSON in `content` |
| `content` | `jsonb` | `NOT NULL` — shape per `lib/content/*` merge functions |
| `sort_order` | `integer` | default `0` — editors set from section order arrays |
| `updated_at` | `timestamptz` | default `now()`, trigger `set_site_content_updated_at` |

**RLS:**

- **SELECT:** `using (true)` — world-readable (anon key can read all rows; suitable for public site).
- **INSERT / UPDATE / DELETE:** `public.is_admin()`.

**Relationships:** No FK to other business tables — logical grouping is `(page, section)`.

### 5.4 Storage: bucket `site-images`

From migration `20260216_add_site_images_bucket.sql`:

- Bucket `id` / `name`: **`site-images`**, **public** read.
- **`storage.objects` RLS** enabled with policies:
  - **SELECT:** any object in `site-images` (public reads).
  - **INSERT / UPDATE / DELETE:** `bucket_id = 'site-images'` **and** `public.is_admin()`.

### 5.5 Seed data

`supabase/seed.sql` inserts default rows for **`page = 'home'`** sections (`hero`, `socialProof`, `services`, `whyUs`, `testimonials`, `gallery`, `localSeo`, `contactCta`) if missing. Portfolio/architecture/branding defaults live in **TypeScript** only until saved from admin.

---

## 6. Environment variables

Required at build/runtime for any route using Supabase (effectively the whole app except purely static assets):

| Variable | Scope | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL (e.g. `https://<ref>.supabase.co`). Used by browser and server Supabase clients and middleware. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase **anon** JWT. RLS enforces access; never use service role key here. |

**Setup:** Copy values from the Supabase project **API** settings into `.env.local` (file is **gitignored**). No other env vars are read in `lib/supabase/env.ts` (throws if either is missing).

**Security note:** Do not commit real keys. If keys were ever committed, rotate them in Supabase.

---

## 7. Pages and routes

Base URL in code: **`https://nounstudio.dz`** (`metadataBase`, sitemap, robots).

| Route | Renders | Access |
|-------|---------|--------|
| `/` | Home sections (DB + defaults) | Public |
| `/architecture` | Architecture page (DB + defaults) | Public |
| `/branding` | Branding page (DB + defaults) | Public |
| `/realisations` | Portfolio gallery + CTA (DB + defaults) | Public |
| `/contact` | Static contact + FAQ + stub form | Public |
| `/sitemap.xml` | Generated from `app/sitemap.ts` | Public |
| `/robots.txt` | Generated from `app/robots.ts` | Public |
| `/admin` | Admin dashboard | **Auth + `role = admin`** (middleware) |
| `/admin/login` | Login form | Public; logged-in **admins** redirect to `/admin` |
| `/admin/homepage` | Homepage CMS | **Auth + admin** |
| `/admin/portfolio` | Portfolio CMS | **Auth + admin** |
| `/admin/architecture` | Architecture CMS | **Auth + admin** |
| `/admin/branding` | Branding CMS | **Auth + admin** |

**Middleware** (`matcher: ['/admin/:path*']`):

- No session → redirect to `/admin/login` (except when already on login — allows login page).
- Session but not `admin` → redirect to `/`.
- `/admin/login` with admin session → redirect to `/admin`.

---

## 8. Components (main reusable)

**Site shell**

- **`SiteHeader`:** Nav links (Accueil, Architecture, Branding, Portfolio, Contact), scroll styling, mobile `Sheet` menu.
- **`SiteFooter`:** (file present) site footer content.
- **`FloatingCTA`:** Mobile-only fixed mailto `contact@nounstudio.dz` after scroll.
- **`BackToTop`:** Return to top control.
- **`ScrollAnimations`:** Mounts `useScrollAnimation` hook (no DOM output).

**Home**

- **`HeroSection`, `SocialProofBar`, `ServicesOverview`, `WhyUsSection`, `TestimonialsSection`, `GalleryPreview`, `LocalSeoSection`, `ContactCtaSection`:** Presentational; fed by merged `HomePageContent`.

**Portfolio**

- **`RealisationsGallery`:** Category filters, masonry grid, lightbox navigation.

**Forms / contact**

- **`ContactForm`:** Client form; **no backend** — fake submit delay and success state.

**Admin**

- **`AdminNav`:** Links to dashboard + four editors + `LogoutButton`; hidden on `/admin/login`.
- **`ImageUpload`:** Supabase Storage upload/remove for `site-images`.
- **`LogoutButton`:** `supabase.auth.signOut()` + navigate.

**UI library**

- **`components/ui/*`:** shadcn/Radix primitives (Button, Card, Dialog, Sheet, Accordion, Input, etc.) — large set for consistent design system.

**Utilities**

- **`SkeletonCard`:** Loading placeholder pattern.
- **`theme-provider.tsx`:** Re-exports `next-themes` — **unused** in current layout.

---

## 9. Authentication and roles

**Provider:** Supabase Auth (email/password in UI).

**Role model:** Single table `public.profiles` with `role` either **`user`** or **`admin`**. Application logic for CMS only accepts **`admin`**.

**Enforcement layers**

1. **Middleware:** Validates JWT via `@supabase/ssr` `createServerClient` with cookies; loads `profiles.role` for route decisions.
2. **Login page:** After `signInWithPassword`, loads profile; if not admin, **signs out** and sends user to `/`.
3. **RLS:** `site_content` mutations and storage writes require `is_admin()`; public reads allowed for content and images.

**Bootstrap:** An admin user must exist in **Auth** with a matching **`profiles`** row (`id` = auth user id, `role = 'admin'`). This is not automated in repo migrations (manual Supabase dashboard or SQL).

---

## 10. Known limitations, technical debt, TODOs

- **`typescript.ignoreBuildErrors: true`** — builds can succeed with TS errors; risky for CI quality gates.
- **Contact form** — no persistence, email, or CRM integration (explicit stub).
- **`package.json` name** — still `my-project`.
- **`styles/globals.css`** — duplicate/unused relative to `app/globals.css`.
- **`next-sitemap`** — unused dependency; sitemap is hand-maintained in `app/sitemap.ts`.
- **`ThemeProvider`** — not integrated; dark/light switching not active site-wide.
- **ESLint** — script references `eslint` without local devDependency.
- **`content_type` column** — schema allows `image` / `list` but application always writes **`text`** for CMS payloads.
- **`robots.txt`** — does not explicitly **disallow** `/admin` (admin URLs may still be discoverable; consider `Disallow: /admin` if desired).
- **Images:** `next.config.mjs` sets `images.unoptimized: true` — no Next image optimization CDN behavior.
- **No automated tests** in repository (no `test` script / test dirs observed).
- **Grep:** No `TODO`/`FIXME` comments in source TS/TSX (limitations inferred from behavior).

---

## 11. Business context

**Problem solved for the client:** Presents **Noun Studio** as a credible, local-first architecture and branding practice (**Oran / Algeria**, reach to **France**), captures positioning (licensed architect, 70+ visual identities, multidisciplinary studio), and provides a **maintainable CMS** so non-developers (with admin accounts) can update copy and imagery without redeploying static copy.

**Inferred requirements from copy and structure:**

- **French-language** primary audience; locale **`fr-DZ`**; emphasis on **Oran** and Algeria for SEO.
- **Services:** Architecture (residential, commercial, renovation, 3D, site monitoring), branding (logo, identity, guidelines, collateral), cultural content tied to Algerian heritage.
- **Trust signals:** Stats, testimonials, portfolio, structured data with founder name and email **`contact@nounstudio.dz`**.
- **Team:** Named roles (architecture lead, graphic design, web/digital) on contact page — aligns with positioning as a small studio.

**Deployment:** Not pinned in repo; typical stack would be **Vercel** or similar for Next + env vars, with Supabase project for production data.

---

## Operational notes

- **Apply migrations** to Supabase in order: `20260216_init.sql`, then `20260216_add_site_images_bucket.sql`.
- **Run seed** (`supabase/seed.sql`) optionally for initial home content.
- **Local dev:** `npm run dev` (Next dev server). Requires `.env.local` with Supabase keys.

---

*Generated from repository analysis; update when schema, routes, or env requirements change.*
