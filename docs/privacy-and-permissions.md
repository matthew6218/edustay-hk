# Data access and consent

Every private API request resolves the same-site HTTP-only session, checks that its account is active, then checks role and ownership. Staff roles cannot be chosen at registration. Passwords use salted PBKDF2 hashes; verification and reset links are random, single-use tokens stored by hash and expire. Sessions end after password reset, logout and account suspension. Recovery email is disabled in this demo.

| Data | Student | Provider | Staff |
| --- | --- | --- | --- |
| Public approved listing | Read public projection | Read public projection | Review |
| Private full address | None | Own listings only | Scoped listing review |
| Student profile | Own | Minimum stated snapshot after introduction consent | No general profile endpoint |
| Introduction | Own | Own listing's lead | Aggregate counts; no general lead-data endpoint |
| Roommate alias/preferences | Compatible opted-in profiles | None | Safety review only |
| Identity documents | Not collected | Not collected | Not collected |

Introduction consent records the timestamp and shares the student's alias, university, budget, move-in dates, lease length and message. Email and phone remain private. Duplicate requests reuse the existing record. Roommate visibility starts hidden; chat requires active opt-in on both profiles, an accepted connection and no block. Hiding discovery, blocking or suspending an account revokes message access.

Students can export JSON and request deletion. Deletion immediately ends the session, hides discovery and marks the account restricted for manual processing; this demo does not claim backups or records were fully erased. Provider-side export/deletion, staff MFA, retention schedules and automated erasure need review before production.
