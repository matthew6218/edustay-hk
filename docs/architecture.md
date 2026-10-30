# Architecture

## Runtime

Next-compatible React pages run through Vinext on a Cloudflare Worker. The Worker adds security headers and exposes D1 (`DB`) and R2 (`BUCKET`) bindings. The browser calls `/api/*`; one server handler validates input, checks an HTTP-only session, enforces role and ownership rules, and runs parameterized SQLite queries. Zod guards public JSON. Database rows are projected to avoid exposing private addresses and contact details, and API responses disable shared caching.

## Request path

```text
Browser (React pages; EN / zh-HK / zh-CN labels)
  -> same-origin JSON API, Origin checks and bounded request sizes
  -> session lookup, role/ownership checks, Zod validation
  -> D1: profiles, listings, saves, leads, roommate consent,
     notifications, reports, support and audit records
  -> R2: provider-owned images, private until referenced by a live listing
```

Property fit is calculated by the deterministic shared module `lib/domain.ts`. Budget, capacity, room type, date overlap and lease length are hard checks. Available soft criteria are normalized to 100 and disclose missing data. Roommate fit is separate and requires both users to opt in. Status-changing actions write audit events and notifications.

## Trust boundaries

- The Site is owner-private and contains named fictional demo accounts. Never open it to unauthenticated public visitors.
- Provider addresses are excluded from public projections. Image uploads belong to the current approved provider and are served only while referenced by a public, live listing, to their owner, or to scoped reviewers.
- Students see their own profile and introductions. Providers see their inventory and leads. Staff endpoints check roles server-side.
- Roommate contact details are never in discovery. Messaging rechecks active opt-in on both profiles, connection acceptance, participant membership and blocks on every request.
- Applicant-entered labels do not grant badges. Listing review does not establish ownership, title, licence or condition.

## Database

`db/schema.ts` is the schema source. `drizzle/0000_lush_deathbird.sql` creates the first schema; `0001_plain_old_lace.sql` adds private-upload metadata. Applied migrations are immutable. Demo data uses stable fixture IDs and idempotent inserts.
