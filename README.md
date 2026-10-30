# EduStay HK

EduStay HK is a private, fictional Hong Kong student-housing marketplace demo. It contains a public site and working student, housing-provider and operations workspaces backed by Cloudflare D1 and R2.

**Every home, provider, rent, availability, review, profile and enquiry in the seeded data is fictional.** Stock photographs illustrate rooms; they do not depict the fictional properties. The demo is for product walkthroughs and software testing, not for arranging a real tenancy.

## Try the demo

1. Open the public home page and choose **Try the demo** in the banner.
2. Sign in as Alex (student), Jamie (second student), Harbour Nest (provider) or Demo reviewer (admin).
3. Explore; demo records persist in the Site database. The role switcher is limited to this owner-private sandbox.

## Run locally

Prerequisites: Node.js 22.13 or later and Git. The Site uses Vinext on Cloudflare Workers with local D1/R2 emulation; no external API keys are needed.

```powershell
npm ci
npm run build
node --import .\scripts\sites-env.mjs .\node_modules\wrangler\bin\wrangler.js d1 execute DB --local --config dist\server\wrangler.json --persist-to .wrangler\state --file drizzle\0000_lush_deathbird.sql
node --import .\scripts\sites-env.mjs .\node_modules\wrangler\bin\wrangler.js d1 execute DB --local --config dist\server\wrangler.json --persist-to .wrangler\state --file drizzle\0001_plain_old_lace.sql
npm start
```

Open the local URL printed by Wrangler. The first API request seeds fictional data idempotently. For an existing database, apply only migrations not yet applied. Applied migration files are immutable. `npm run db:generate` creates a new migration from `db/schema.ts`; `npm run db:seed` verifies a running local demo server and triggers its idempotent fixture seed.

## Checks

```powershell
npx tsc --noEmit
npm run lint
node --test tests/unit/*.test.mjs
node --test --test-concurrency=1 tests/integration/*.test.mjs
```

Integration checks mutate fictional records and run only against loopback. Start the local server first. Seed fixtures are safe to reuse; a fresh, uniquely named test account is created on each run.

## What's implemented

- Public marketing, help, privacy, terms and safety pages; EN, Traditional Chinese and Simplified Chinese UI labels.
- Password registration/login, salted PBKDF2 hashes, one-time demo verification and reset links, seven-day HTTP-only sessions, and server-checked roles and ownership.
- Housing-profile wizard, search and filters, bounded results, swipe/pass/undo, shortlist, comparison, explainable deterministic matching and sample property details.
- Consent-gated introductions, provider lead inbox, status history, participant messaging after acceptance, notifications, data export and deletion request.
- Provider application, private image uploads, listing drafts, editing, owner-only inventory and leads, reviews and availability refresh.
- Scoped reviewer/moderator/support queues, publication and suspension, reports, account restriction and audit events.
- Roommate discovery switched off by default, up to three opt-in priorities, mutual requests, blocking and consent-checked chat.
- Privacy controls, tour/gallery fallback, HTTPS allowlisted tour embeds, request limits and security headers.

## Demo limitations

The owner-private demo disables email delivery, staff MFA, real-world identity or ownership verification, commute routing, financial transactions, rent/deposit collection, escrow, sponsored ranking, university endorsement and leases. Verification and reset links appear only inside this demo. Lease outcomes are self-reported. Reviewer approval covers submitted listing information only.

Before accepting real users, replace demo role switching, implement production authentication and staff MFA, configure transactional email, review Hong Kong privacy and estate-agency obligations with qualified counsel, approve data retention/hosting/transfer terms, define real verification scopes, test backups and review abuse controls. See [decisions](docs/decisions.md) and [known limitations](docs/known-limitations.md).

## Photo credits

Demonstration stock images are used under the [Unsplash License](https://unsplash.com/license). Credits and source links are in [asset credits](docs/asset-credits.md). Sample photos are labelled illustrative in the interface.
