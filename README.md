# Big Five Career Hub

A US-first monorepo for a focused Big Tech jobs and interview prep product covering Amazon, Apple, Google, Meta, and Microsoft.

## Stack

- `apps/web`: Next.js 15, App Router, Tailwind CSS
- `packages/db`: PostgreSQL schema and Drizzle client
- `packages/content`: MDX company hubs, prep guides, resources, and curated job seeds

## Quick Start

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.
4. Open `http://localhost:3000`.

## Useful Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:seed`
- `npm run db:setup`

## Notes

- Jobs are manually curated and link to official employer apply pages.
- The waitlist and admin import endpoints expect a live PostgreSQL `DATABASE_URL`.
- If the database is not configured, the import flow still provides validation previews.
- Seed data pulls the launch companies and curated jobs from `@bigfive/content`.
