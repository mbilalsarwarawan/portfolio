# Copilot Instructions — Muhammad Bilal Awan's Portfolio

## Project Overview
Full-stack portfolio site for a software developer. Built with **Next.js 15 App Router**, **Supabase** (auth + database + storage), and the **Vercel AI SDK** for an embedded chatbot assistant.

All application code lives under `site/`. The workspace root (`/home/bilal/office/portfolio`) only contains `README.md` and `site/`.

---

## Commands (run from `site/`)

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (no test suite exists)
```

---

## Architecture

```
site/
├── app/                    # Next.js App Router
│   ├── (public pages)      # page.tsx, about/, projects/, contact/
│   ├── admin/              # Protected admin dashboard
│   │   ├── (dashboard)/    # Route group — sidebar layout + CRUD pages
│   │   └── login/          # Public login page
│   └── api/                # Route Handlers (REST)
├── components/             # Shared React components
├── lib/
│   ├── data.ts             # Static fallback data + TypeScript interfaces
│   ├── chatbot-context.ts  # Builds AI system prompt from Supabase
│   └── supabase/           # Three distinct Supabase clients (see below)
└── supabase/               # schema.sql + seed.sql
```

### Supabase Client Selection

| File | Used in | Key |
|------|---------|-----|
| `lib/supabase/client.ts` | Browser components | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `lib/supabase/server.ts` | Server Components, API routes | `NEXT_PUBLIC_SUPABASE_ANON_KEY` + cookies |
| `lib/supabase/admin.ts` | Privileged mutations (POST/PUT/DELETE) | `SUPABASE_SERVICE_ROLE_KEY` |

**Always** use `admin.ts` for write operations in API routes (not the server client). The server client is for reads that respect RLS.

---

## API & Auth Patterns

- **Auth**: Supabase email/password via `/api/auth/login` → session stored in HTTP-only cookies.
- **Route protection**: `middleware.ts` guards all `/admin/*` routes. Any server-side auth check **must** call `supabase.auth.getUser()` — never trust the session cookie directly.
- **Auth on mutating API routes**: Routes do NOT re-validate auth themselves — middleware handles it. Admin writes use the service-role client which bypasses RLS.
- **Rate limiting**: `/api/chat` is limited to 15 messages per IP per 24 hours (in-memory — resets on server restart).

---

## Database Tables (Supabase PostgreSQL)

| Table | Key columns |
|-------|-------------|
| `projects` | `id`, `slug`, `title`, `description`, `image_url`, `tags[]`, `year`, `role`, `content`, `live_url`, `github_url`, `display_order` |
| `skills` | `id`, `name`, `category`, `display_order` |
| `experiences` | `id`, `period`, `role`, `company`, `description`, `display_order` |
| `about` | `id`, `bio`, `resume_url` |
| `contact_info` | `id`, `email`, `phone`, `location`, `github_url`, `linkedin_url` |

Storage bucket: `portfolio-files` (images + PDFs, max 5 MB, jpg/png/webp/pdf only).

No Prisma — all queries use the Supabase JS client directly.

---

## Design System

- **Dark mode**: Class-based (`dark` on `<html>`). Toggle via `ThemeToggle` component; state managed in `RootLayoutClient`.
- **CSS variables**: `--bg`, `--text-primary`, `--text-secondary`, `--accent`, `--border` (defined in `app/globals.css`). Always use these instead of hardcoded Tailwind color classes.
- **Typography**: `--font-space-grotesk` (headings), `--font-dm-sans` (body).
- **Animations**: Framer Motion throughout. Consistent easing: `[0.16, 1, 0.3, 1]`. Import from `framer-motion`.
- **Tailwind**: v4 with `@tailwindcss/postcss`. Config is in both `tailwind.config.ts` (reference) and `tailwind.config.js`.

---

## Component Conventions

- Filename: PascalCase (`ProjectCard.tsx`), not kebab-case.
- Use `@/` alias for all internal imports (`@/components/...`, `@/lib/...`).
- Client components need `"use client"` at the top; prefer Server Components for data display pages.
- Admin dashboard pages are Server Components that fetch data directly from Supabase — no client-side fetch.
- Public pages that need interactivity use a `*Client.tsx` naming pattern (e.g., `ProjectsPageClient.tsx`).

---

## AI Chatbot

- Route: `POST /api/chat` — streams responses via Vercel AI SDK `streamText`.
- AI provider: **Groq** (`@ai-sdk/groq`) with Google as secondary (`@ai-sdk/google`).
- System prompt: Built dynamically in `lib/chatbot-context.ts` by fetching live Supabase data.
- Client: `ChatPanel.tsx` uses `useChat()` from `@ai-sdk/react`. Persists messages to `localStorage`, caps at 15/session.
- Tools: `searchProjects`, `getProjectDetail`, `suggestNavigation`, `getContactInfo`.

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI (at least one required for /api/chat)
GROQ_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=   # optional fallback
```

See `.env.local.example` in `site/` for the full template.

---

## Known Issues / TODOs

- **Contact form** (`/api/contact`) logs submissions to console only — no email service wired up yet.
- **Rate limiting** is in-memory and resets on server restart — not production-safe for high traffic.
- `lib/data.ts` contains static fallback data that duplicates Supabase content; chatbot uses live Supabase data, public pages use API routes.
- No automated tests exist (`npm run lint` is the only CI check).

---

## Key File Quick Reference

| What you need | Where to look |
|---------------|---------------|
| Page metadata / fonts | `app/layout.tsx` |
| Global CSS variables + base styles | `app/globals.css` |
| Static type interfaces (`Project`, etc.) | `lib/data.ts` |
| Chatbot system prompt logic | `lib/chatbot-context.ts` |
| Admin sidebar nav items | `app/admin/(dashboard)/layout.tsx` |
| DB schema (source of truth) | `supabase/schema.sql` |
| Seed data | `supabase/seed.sql` |
