# Deployment Notes

This app is ready to deploy as a Next.js application, with a few production environment values required before admin/import flows are enabled.

## Required Environment Variables

- `NEXT_PUBLIC_SITE_URL`: canonical public URL for metadata, sitemap, and robots.
- `ADMIN_USERNAME`: HTTP Basic Auth username for `/admin/*` and `/api/admin/*`.
- `ADMIN_PASSWORD`: long random password for `/admin/*` and `/api/admin/*`.

## Required Once Database Features Are Enabled

- `DATABASE_URL`: PostgreSQL connection string for runtime reads/writes such as waitlist persistence, seeds, and admin import commits. Prefer a least-privileged app role.
- `MIGRATION_DATABASE_URL`: optional privileged PostgreSQL connection string for `npm run db:migrate`. If omitted, migrations fall back to `DATABASE_URL`.

## Optional Environment Variables

- `NEXT_PUBLIC_POSTHOG_KEY`: enables PostHog browser analytics.
- `NEXT_PUBLIC_POSTHOG_HOST`: defaults to `https://us.i.posthog.com`.

## Pre-Deploy Checks

Run these locally or in CI:

```bash
npm run test
npm run lint
npm run build
npm audit --omit=dev
```

When `DATABASE_URL` points at a live database, run this smoke check:

```bash
npm run smoke:db
```

It confirms seeded company/job reads plus temporary waitlist and admin-import writes, then removes the smoke rows.

Use this content check before a public launch:

```bash
npm run readiness:content
```

The content readiness script intentionally warns on generic official careers/search links. Those are functional but should be upgraded to exact official role URLs before a public launch.

## Health Check

`/api/health` returns a lightweight JSON response for deployment monitoring.
