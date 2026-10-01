# Automated SEO SaaS — Security Plan

**Security status:** Threat model defined (M0). M4 controls are BLOCKED pending M1-M3 implementation.
**Current milestone:** M4

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

1. **User Identity & Auth Data:** (Supabase Auth) Stored securely, retained until account deletion.
2. **Organization & Project Metadata:** Retained while subscription/trial is active.
3. **Crawl Observations & Audit Runs:** Retained for 90 days to allow historical comparison.
4. **AI Output & Recommendations:** Retained for 90 days or until explicitly approved and applied.
5. **Applied Fixes / Change Sets:** Retained indefinitely to maintain audit trail of changes.
6. **Billing & Usage Records:** (Stripe) Retained for 7 years for tax/compliance purposes.
7. **Google-sourced Content (GSC/GBP):** (Temporary cache) Retained max 30 days or as per Google API policy. Removed on project disconnect/revocation.

### Incident Response Ownership

Initial incident response ownership is assigned to the Founding Engineering Team / Lead Developer. Roles will expand to a dedicated on-call rotation as the SaaS scales to production (M8/M9).

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

## Detailed Initial Threat Model (M0)

| Threat | Required Control | Verification State |
|---|---|---|
| Tenant Isolation | RLS in Supabase, tenant-scoped DB queries | UNVERIFIED |
| Account Takeover | Email verification, rate limiting | UNVERIFIED |
| OAuth Mix-ups | State binding, strict callback URLs | UNVERIFIED |
| SSRF | Network policy restrictions, IP validation | UNVERIFIED |
| DNS Rebinding | Resolve securely at connection time | UNVERIFIED |
| Crawler Exhaustion | Strict timeouts, page budget, depth limit | UNVERIFIED |
| Prompt Injection | Output parsing schemas, restricted context | UNVERIFIED |
| Stored XSS | React escaping, restricted HTML sanitizer | UNVERIFIED |
| SQL/Command Injection | Postgres parameterized queries via ORM/SDK | UNVERIFIED |
| Secrets Leakage | Environment variables only, no hardcoded keys | UNVERIFIED |
| Payment Replay | Stripe webhook signature verification | UNVERIFIED |
| Usage Bypass | Server-authoritative entitlement checking | UNVERIFIED |
| Duplicate Jobs | Idempotency keys on Inngest | UNVERIFIED |
| Publishing Authorization | Explicit project matching on target URL | UNVERIFIED |
| Concurrent Edits | Hash checking before apply | UNVERIFIED |
| Data Loss | Supabase automated backups | UNVERIFIED |
| Admin Access | Separate role, no customer impersonation without consent | UNVERIFIED |
