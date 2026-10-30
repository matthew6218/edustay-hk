# EduStay HK

EduStay HK is a fictional Hong Kong student-housing marketplace demo. It contains a public site and working student, housing-provider and operations workspaces. This GitHub version runs on Next.js with Turso/libSQL for records and private Vercel Blob storage for uploads. Keep the hosted demo behind deployment protection: the demo role switcher includes staff accounts.

**Every home, provider, rent, availability, review, profile and enquiry in the seeded data is fictional.** Stock photographs illustrate rooms; they do not depict the fictional properties. The demo is for product walkthroughs and software testing, not for arranging a real tenancy.

## Try the demo

1. Open the public home page and choose **Try the demo** in the banner.
2. Sign in as Alex (student), Jamie (second student), Harbour Nest (provider) or Demo reviewer (admin).
3. Explore; demo records persist in the configured database. This build is intended for a private sandbox.

## Deploy on Vercel

The build now runs `next build` and generates `.next/routes-manifest.json`. The checked-in `vercel.json` selects the Next.js preset, `npm run build`, and `.next`. Use Node.js 24.x and the repository root as the Root Directory. Do not override the build with `vinext build` or select `dist` as the output.

1. Create a Turso **libSQL-compatible** database. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to the Vercel project's environment variables. Use a separate database for Preview deployments if enabled.
2. Create a **private** Vercel Blob store and connect it to the project. This supplies `BLOB_READ_WRITE_TOKEN`. Public Blob stores are not compatible with the app's private upload access controls.
3. Apply the database schema once before using the app. On your computer, put the database URL and token in the ignored `.env.local` file, then run `npm ci` and `npm run db:migrate`. The command records applied migrations, checks their hashes, and safely skips them on later runs. It does not copy data from the original Cloudflare database. Keep migration credentials out of Git.
4. Redeploy on Vercel after configuring the variables. The first API request inserts the fictional sample records. Enable Vercel Deployment Protection for this demo, including the production deployment.

No credentials are needed to compile the app, but hosted database credentials are required for the API. Missing database configuration returns HTTP 503; missing Blob configuration disables uploads. Vercel never falls back to an ephemeral local database or upload folder. Build commands do not migrate or mutate a production database.

Images are limited to 3 MB so the base64 JSON request fits Vercel Functions' request size limit. Uploaded images remain private in Blob and are served through the API only after checking the owner, staff role, or an approved live listing.

See [Turso with Vercel](https://docs.turso.tech/integrations/vercel), [private Vercel Blob storage](https://vercel.com/docs/vercel-blob/private-storage), and [Vercel deployment protection](https://vercel.com/docs/deployment-protection).

## Run locally

Prerequisites: Node.js 22.18 or later (24.x recommended) and Git. Without hosted storage variables, local development uses SQLite at `.data/edustay.db` and private files under `.data/media`. These are ignored by Git. No external API keys are needed locally.

```powershell
npm ci
npm run db:migrate
npm run build
npm start
```

Open http://localhost:5173. Use `npm run dev` for development. The first API request seeds fictional data idempotently. Applied migration files are immutable. `npm run db:generate` creates a new migration from `db/schema.ts`; `npm run db:migrate` applies pending migrations; `npm run db:seed` verifies a running local demo server and triggers its idempotent fixture seed.

The old Cloudflare/Sites build scaffolding is retained for reference. It is no longer the deployment path for this repository; the original hosted Site is separate and has not been changed.

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
