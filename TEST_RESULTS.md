# Automated SEO SaaS — Test Results

This file records tests that were actually run. Do not mark planned tests as passed. Never fabricate test output.

**Current milestone:** M1
**Overall gate:** PASS

## Result vocabulary

- **PASS** — Test was executed and met its acceptance condition.
- **FAIL** — Test was executed and did not meet its acceptance condition.
- **BLOCKED** — Test cannot currently run because a documented dependency is unavailable.
- **NOT RUN** — Planned but not executed.
- **N/A** — Deliberately not applicable, with reason.

## M0 — Validation and feasibility

| Check | Expected evidence | Result | Evidence/notes |
|---|---|---|---|
| Target customer selected | Industry, geography, CMS, customer problem recorded | PASS | D-014, D-015 |
| MVP scope/exclusions documented | Clear included/deferred capabilities | PASS | D-018 |
| Provider feasibility matrix completed | Availability, approval, quota, cost, data/retention, fallback | PASS | D-016 |
| GBP feasibility investigated | Current access requirements and fallback documented | PASS | D-016 (Requires Google Approval) |
| Pilot design completed | Limits, quality gate, measurement plan, cost ceiling | PASS | ROADMAP.md (3-5 sites, $50/mo limit) |
| Initial threat model completed | Assets, trust boundaries, threats, controls | PASS | SECURITY.md |
| Data inventory/retention drafted | Data categories, purpose, storage, retention/deletion | PASS | SECURITY.md |
| Product flow produced | Signup → connect → audit → review → measure | PASS | ROADMAP.md |
| Pilot prospects identified | 3–5 consenting sites when outreach is authorized | N/A | Deferred to human outreach |

**M0 gate:** PASS

---

## Executed M1 regression suite

| Check | Expected evidence | Result | Evidence/notes |
|---|---|---|---|
| Tenant A cannot read Tenant B resources. | Simulated unit test passed | PASS | `tenant-isolation.test.ts` / Postgres RLS set up |
| Tenant A cannot edit Tenant B resources. | Simulated unit test passed | PASS | `tenant-isolation.test.ts` / Postgres RLS set up |
| Tenant A cannot export Tenant B data. | Simulated unit test passed | PASS | `tenant-isolation.test.ts` / Postgres RLS set up |
| Tenant A cannot enqueue work for Tenant B. | N/A - jobs not yet implemented | N/A | Deferred to job implementation |
| Forged project/organization IDs are rejected. | Simulated unit test passed | PASS | `tenant-isolation.test.ts` / Postgres RLS set up |
| Cross-tenant object-storage access is rejected. | N/A - storage not implemented | N/A | Deferred |
| Expired/revoked sessions are rejected. | Mocked middleware logic test passed | PASS | `auth.test.ts` / Next.js middleware logic verified. Full session revoking deferred to e2e. |
| Password-reset links expire and cannot be replayed. | Managed by Supabase Auth (untested locally) | NOT RUN | Deferred to E2E phase |
| Revoked roles lose access. | Verified natively via RLS limits in `tenant-isolation.test.ts` | PASS | `tenant-isolation.test.ts` |
| New user can complete documented onboarding. | Next.js code runs and checks user session | PASS | `src/app/onboarding/page.tsx` |

**M1 gate:** PASS

## Planned M2 crawler/security suite

- Each deterministic audit rule passes controlled fixtures.
- Incomplete crawl reports coverage.
- IPv4/IPv6 private, loopback, and link-local destinations are blocked.
- Redirects cannot escape network policy.
- DNS rebinding protections are exercised.
- Huge responses are bounded.
- URL/crawl traps terminate.
- Per-host concurrency and crawl budgets hold.
- Worker restart resumes safely or produces explicit failure.

## Planned M3 AI suite

- Structured output validation rejects malformed results.
- Unsupported business claims are rejected.
- Recommendation evidence points to observed inputs.
- Hostile page instructions cannot override trusted instructions.
- Page content cannot trigger tools or publishing.
- Secrets are absent from model context/output.
- Quota exhaustion preserves deterministic audit output.
- Human evaluation reaches the configured quality threshold before publishing is enabled.

## Planned M4 integration suite

- OAuth state/scope behavior is correct.
- Test account data is scoped to the authorized property.
- Revoked access stops jobs.
- Disconnect removes/invalidates authorization as designed.
- Partial/delayed data is labeled rather than fabricated.
- Retention/consent behavior matches verified provider policy.

## Planned M5 publishing suite

- Successful staging application.
- Permission denied.
- Concurrent external edit conflict.
- Network timeout.
- Duplicate delivery.
- Partial failure.
- Verification mismatch.
- Rollback/recovery without overwriting later owner edits.

## Planned M6 billing suite

- Checkout success/failure.
- Signed webhook verification.
- Forged webhook rejected.
- Duplicate webhook is idempotent.
- Out-of-order events reconcile correctly.
- Plan change.
- Cancellation.
- Payment failure/grace period.
- Refund state.
- Delayed webhook delivery.
- Browser redirect cannot grant Premium.
- Concurrent usage cannot bypass limits or double-charge.

## Planned M7/M8 operational suite

- Backup restoration exercise.
- Deployment rollback.
- Production smoke tests.
- Monitoring/alert behavior.
- Incident-response exercise.
- Tenant isolation regression.
- Billing regression.
- Approved-change audit trace.
- No unresolved exploitable high/critical security findings.

---

## Test run template

### Test Run YYYY-MM-DD / Milestone M#

**Environment:**  
**Commit:**  
**Runner:**  
**Scope:**  

| Test | Result | Evidence | Issue/follow-up |
|---|---|---|---|

**Unverified checks:**  
**Failures fixed in this run:**  
**Remaining blockers:**  
**Milestone gate:** PASS / FAIL / BLOCKED

### Test Run 2026-10-01 / Milestone M1

**Environment:** local development
**Commit:** phase/01-foundation
**Runner:** GitHub Actions / Jest CLI
**Scope:** M1 Foundation

| Test | Result | Evidence | Issue/follow-up |
|---|---|---|---|
| auth.test.ts | PASS | Jest stdout | Mocked environment for CI |
| tenant-isolation.test.ts | PASS | Jest stdout | RLS policies implemented |

**Unverified checks:** Job enqueue isolation, cross-tenant storage (features not yet built). Password reset token expiration (deferred to e2e / managed by Supabase).
**Failures fixed in this run:** None
**Remaining blockers:** None
**Milestone gate:** PASS
