# Automated SEO SaaS — Security Plan

**Security status:** Initial threat model; controls are requirements until verified by tests.  
**Current milestone:** M0

## Security principles

1. Enforce tenant isolation and permissions on the server, including routes, workers, caches, exports, reports, and object storage.
2. Authenticate and authorize every background job and integration action.
3. Treat crawled content and AI output as untrusted data, never as instructions.
4. Keep credentials server-side, encrypted where stored, and redacted from logs.
5. Use explicit timeouts, quotas, cost ceilings, bounded retries, cancellation, and recovery paths.
6. Require human approval before customer-facing changes by default.
7. Never treat successful UI navigation or browser redirects as proof of server-side authorization or payment.
8. Use least privilege for OAuth scopes, customer roles, workers, and administrators.
9. Do not run intrusive security testing against customer/third-party systems without explicit authorization.

## Initial threat model

| Threat | Required control | Verification state |
|---|---|---|
| Cross-tenant data access | Server-side membership checks, tenant-scoped DB/storage/cache access | UNVERIFIED |
| Forged project/job identifiers | Authorize target organization/project before enqueue and execution | UNVERIFIED |
| Account takeover | Verified email, rate limits, secure reset/session handling, privileged MFA | UNVERIFIED |
| OAuth account mix-up | State binding, PKCE where applicable, exact callbacks, narrow scopes | UNVERIFIED |
| SSRF/internal network access | Safe DNS/IP validation, restricted egress, revalidation on redirects/resources | UNVERIFIED |
| DNS rebinding | Resolve safely at connection time and enforce network policy | UNVERIFIED |
| Crawl resource exhaustion | Page/byte/time/concurrency budgets and cancellation | UNVERIFIED |
| Browser-rendering escape | Isolated workers and policy enforcement on all requests/subresources | UNVERIFIED |
| Prompt injection | Separate trusted instructions from page data; no secrets/autonomous tools in model context | UNVERIFIED |
| Stored XSS | Escape output; sanitize allowed HTML; restrictive content policy | UNVERIFIED |
| SQL/command injection | Parameterized DB access, schema validation, no shell interpolation | UNVERIFIED |
| Secret leakage | Secret manager/server-only configuration, artifact/log scanning, redaction | UNVERIFIED |
| Payment forgery/replay | Signature verification, event ledger, replay protection, idempotency, reconciliation | UNVERIFIED |
| Trial/usage bypass | Atomic usage reservation and server-enforced entitlements | UNVERIFIED |
| Duplicate public changes | Operation IDs, state machine, idempotency, read-after-timeout reconciliation | UNVERIFIED |
| Concurrent owner edits | Snapshot + content hash + conflict detection; invalidate stale approval | UNVERIFIED |
| Data loss | Encrypted backups and tested isolated restoration | UNVERIFIED |
| Supply-chain compromise | Lockfiles, pinned dependencies where appropriate, dependency/license/secret scans | UNVERIFIED |
| Unauthorized admin access | Least privilege, MFA, time-limited audited support access | UNVERIFIED |
| CSRF/unwanted state change | Framework-appropriate CSRF/origin/session protections | UNVERIFIED |

## Crawler security requirements

- Public HTTP(S) targets only.
- Validate every requested URL, redirect destination, and browser subresource.
- Deny loopback, private, link-local, metadata-service, and otherwise prohibited network destinations for IPv4 and IPv6.
- Apply network isolation in addition to application validation.
- Bound redirects, response bytes, pages, depth, duration, retries, and per-host concurrency.
- Do not crawl login areas or bypass access controls.
- Do not send customer cookies to crawled websites.
- Treat canonical URLs as metadata, not authorization to crawl another host.

## AI security requirements

- AI receives only the minimum data needed for the task.
- Crawled content cannot alter system instructions or trigger tools/actions.
- No secrets or privileged credentials enter model context.
- Validate structured outputs against explicit schemas/enums/length limits.
- Reject unsupported factual business claims.
- Record model/provider/version and evidence references where appropriate.
- Quota/provider failure must degrade safely to the deterministic audit.
- No silent switch to paid inference during the free-only pilot.

## Publishing security requirements

Approval must bind to:

- organization/project
- exact target
- exact allowed operation
- exact proposed content/hash
- approving actor
- approval time/version

Before applying a change:

1. Reauthorize the actor/integration.
2. Read current value.
3. Detect conflicting edits.
4. Capture prior value/snapshot.
5. Apply only approved fields.
6. Verify resulting value.
7. Record outcome and provider response.
8. Do not overwrite subsequent owner edits during rollback without review.

## Billing security requirements

- Hosted checkout/payment collection.
- Verify webhook signatures.
- Persist processed event identifiers.
- Handle duplicate and out-of-order events idempotently.
- Reconcile provider state server-side.
- Browser redirects do not grant entitlements.
- Usage counters/reservations must be atomic.
- Log billing state transitions without exposing sensitive payment data.

## Data and retention

### Data Inventory
- **User Account Data**: Email, Auth token, Organization ID, Roles. (Stored in DB)
- **Customer Business Facts**: Confirmed Name, Address, Phone, Hours, Service Area. (Stored in DB)
- **Billing Data**: Stripe customer IDs, subscription status, entitlements. (Stored in DB, syncs with Stripe)
- **Audit Findings & AI Drafts**: Crawled URLs, raw HTML snapshots, parsed metadata, technical observations, semantic recommendations. (Stored in DB & Object Storage)
- **Google Search Console Data**: Read-only metrics (Impressions, clicks, rankings). (Transiently cached/stored per API policy)
- **Google Business Profile Data**: Verified locations, business details. (Transiently cached/stored per API policy)

### Preliminary Retention Schedule
- **Active Subscription/Trial Data**: Retained indefinitely while account is active.
- **Canceled/Expired Accounts**: Retained read-only for 90 days, then permanently deleted.
- **Audit Snapshots/Raw HTML**: Retained for 30 days to save storage costs.
- **Google API Data**: Retained only as long as permitted by the respective Google API policies (e.g., temporary storage up to 30 days for GBP). Must be explicitly deleted upon user disconnect or revocation.
- **Worker Logs**: 7-30 days (depending on platform, e.g., Vercel/Inngest).

### Incident Response
- **Incident Response Owner**: The Project Founder/Lead Developer is currently responsible for all incident response during Phase 0 and the pilot phase.

## Release security gate

A milestone cannot be marked PASS when a required security dependency for that milestone is unverified or when an exploitable high/critical issue remains unresolved.

## Security finding template

### SEC-XXX — Finding title

**Milestone:**  
**Severity:** Critical / High / Medium / Low  
**Status:** OPEN / FIXED / ACCEPTED / BLOCKED  
**Affected component:**  
**Evidence:**  
**Impact:**  
**Minimal fix:**  
**Regression test:**  
**Verification result:**  
**Remaining risk:**
