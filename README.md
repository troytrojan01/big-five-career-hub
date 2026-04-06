# Big Five Career Hub

A US-first monorepo for a focused Big Tech jobs and interview prep product covering Amazon, Apple, Google, Meta, and Microsoft.

## Stack

- `apps/web`: Next.js 15, App Router, Tailwind CSS
- `packages/db`: PostgreSQL schema and Drizzle client
- `packages/content`: MDX company hubs, prep guides, resources, and curated job seeds

## Quick Start

1. Copy `.env.example` to `.env`.
2. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before deploying admin routes.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.
5. Open `http://localhost:3000`.

## Useful Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run readiness:content`
- `npm run readiness:env`
- `npm run smoke:db`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:seed`
- `npm run db:setup`

## Notes

- Jobs are manually curated and link to official employer apply pages.
- The waitlist and admin import endpoints expect a live PostgreSQL `DATABASE_URL`.
- Use a least-privileged app role for `DATABASE_URL` when possible. Use `MIGRATION_DATABASE_URL` only for schema migrations that need elevated database privileges.
- `npm run smoke:db` verifies live database reads plus temporary waitlist and admin-import writes, then cleans up its test rows.
- If the database is not configured, the import flow still provides validation previews.
- Seed data pulls the launch companies and curated jobs from `@bigfive/content`.
- Admin job operations are available at `/admin/jobs`; CSV/JSON import validation is available at `/admin/import`.
- Admin routes use HTTP Basic Auth when `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set. In production, missing admin credentials block admin access.
- `npm run readiness:env` validates production environment variables before deployment. It is expected to fail until production-strength secrets are configured.
- Deployment notes live in `DEPLOYMENT.md`.
