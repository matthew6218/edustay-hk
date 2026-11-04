# EduStay HK

EduStay HK is a fictional Hong Kong student-housing marketplace demo. The default version runs its student, provider and reviewer workflows entirely in each visitor's browser. No database account, API credentials or upload service is needed.

Public sample homes use linked real-market listing snapshots checked on 3 November 2026. Their titles, asking rents, areas and room counts came from those sources; current availability and other terms are unconfirmed. Demo provider accounts, profiles, reviews and enquiries are fictional and do not represent the original listing agents. Stock photographs are illustrative. The demo is for product walkthroughs and software testing, not for arranging a real tenancy.

## Try the demo

1. Open the home page and choose **Try the demo**.
2. Choose Alex (student), Jamie (second student), Harbour Nest (provider), or Demo reviewer (admin).
3. Search, save homes, submit enquiries, switch roles to reply, upload sample images, or review a listing.

Changes and uploaded images are saved in this browser's site storage and survive refreshes and navigation. Each browser profile gets an independent fictional sandbox. Tabs share the same sample records but retain their own selected role. To start fresh, clear the site's browser storage. Clearing it removes local demo records and uploads.

These are simulated accounts and permission checks for a product walkthrough, not secure multi-user hosting. No conversations or listings are sent to other visitors. Use fictional information only. A current browser with WebAssembly, Web Locks and site storage enabled is required.

## Deploy on Vercel

Import the repository and deploy with its checked-in settings. **No environment variables or database setup are required.** If you previously enabled `NEXT_PUBLIC_DATA_MODE=server`, remove that variable and redeploy to use the browser demo.

The build runs `next build` and generates `.next/routes-manifest.json`. `vercel.json` selects the Next.js preset, `npm run build`, and `.next`. Use Node.js 24.x and the repository root as the Root Directory. `prebuild` prepares the local demo engine and schema assets. Do not override the build with `vinext build`.

The client loads its demo engine and schema from this website, then keeps records, session state and image uploads locally. Uploaded images are limited to 3 MB. `/api/health` reports `browser-demo`; other server API endpoints are intentionally inactive in this mode because there is no shared backend.

## Run locally

Prerequisites: Node.js 22.18 or later (24.x recommended) and Git.

```powershell
npm ci
npm run build
npm start
```

Open http://localhost:5173. Use `npm run dev` for development. No migration or seed command is needed for the browser demo.

## Checks

```powershell
npm run test:unit
npm run test:integration
npm run build
```

The integration suite runs all workflows using the real local demo engine and emulated IndexedDB. No server or external service is needed. Tests also cover persistence across page runtimes, independent browser profiles, concurrent writes, sessions, uploads, role permissions and moderation.

## Optional server mode

The previous Turso/Vercel Blob implementation remains available only when `NEXT_PUBLIC_DATA_MODE=server` is set before building. In that mode, configure `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` and a private store's `BLOB_READ_WRITE_TOKEN`. Run `npm run db:migrate` with the database credentials in the ignored `.env.local` file, then redeploy. Local server mode defaults to `.data/edustay.db` and `.data/media`; Vercel never uses ephemeral filesystem storage.

Server mode is still a fictional shared demo with selectable staff personas and should be protected from real users. It does not copy the browser's demo records or the original Cloudflare data. Applied SQL migrations are immutable; `npm run db:generate` creates new migrations, and `npm run db:migrate` applies pending ones. Set `TEST_BROWSER_DEMO=0` when running integration tests against a local server in server mode.

The old Cloudflare/Sites scaffolding is retained for reference and is no longer this repository's deployment path. The original hosted Site has not been changed.

## What's implemented

- Public marketing, help, privacy, terms and safety pages; EN, Traditional Chinese and Simplified Chinese UI labels.
- Password registration/login, salted PBKDF2 hashes, one-time demo verification and reset links, simulated seven-day sessions, and shared role/ownership validation. HTTP-only cookies apply only in optional server mode.
- Housing-profile wizard, search and filters, bounded results, swipe/pass/undo, shortlist, comparison, explainable deterministic matching and sample property details.
- The preset student profile favours the demo neighbourhoods. Two clearly fictional semester rooms show how stated stay dates affect fit; linked real-market samples keep availability unconfirmed until checked at their source.
- Rotatable 3D-style room illustration on every sample home. The shared template is labelled as illustrative and does not represent a property's actual layout; provider-supplied tours remain separate.
- Consent-gated introductions, provider lead inbox, status history, participant messaging after acceptance, notifications, data export and deletion request.
- Provider application, private image uploads, listing drafts, editing, owner-only inventory and leads, reviews and availability refresh.
- Scoped reviewer/moderator/support queues, publication and suspension, reports, account restriction and audit events.
- Registered students start roommate discovery switched off; the fictional demo student has a preset discoverable profile. Profiles support up to three priorities, mutual requests, blocking and consent-checked chat.
- Privacy controls, tour/gallery fallback, HTTPS allowlisted tour embeds, request limits and security headers.

## Demo limitations

The fictional demo disables email delivery, staff MFA, real-world identity or ownership verification, commute routing, financial transactions, rent/deposit collection, escrow, sponsored ranking, university endorsement and leases. Verification and reset links appear only inside this demo. Lease outcomes are self-reported. Reviewer approval covers submitted listing information only.

Before accepting real users, replace demo role switching, implement production authentication and staff MFA, configure transactional email, review Hong Kong privacy and estate-agency obligations with qualified counsel, approve data retention/hosting/transfer terms, define real verification scopes, test backups and review abuse controls. See [decisions](docs/decisions.md) and [known limitations](docs/known-limitations.md).

## Photo credits

Demonstration stock images are used under the [Unsplash License](https://unsplash.com/license). Credits and source links are in [asset credits](docs/asset-credits.md). Sample photos are labelled illustrative in the interface.
