# Changelog

All notable project changes should be recorded here. Do not claim implementation work that has not actually occurred.

The format is milestone-oriented so Google Jules or another coding agent can append concise, auditable entries after each completed task.

## [Unreleased]

### Added

- None.

### Changed

- None.

### Fixed

- None.

### Security

- None.

### Tests

- None.

### Known limitations

- None.

### Gate

- None.

---

## [2026-10-02] — M8 — Narrow production launch

### Added
- None (BLOCKED by missing pilot evidence).

### Changed
- Marked M8 status to BLOCKED in `ROADMAP.md` and `TEST_RESULTS.md`.
- Documented blocking reason in `DECISIONS.md`.
- Updated `SECURITY.md` current milestone to M8.

### Fixed
- None.

### Security
- None.

### Tests
- M7 precondition checks failed due to missing pilot evidence.

### Known limitations
- M8 code cannot be written until M7 pilot evidence is available, per operating instructions.

### Gate
- **BLOCKED**
- Reason: The required pilot evidence for M7 does not exist, which blocks the M8 launch preparation.
- Next milestone: N/A

---

## [2026-10-01] — M9 — Scale validated platform workflows

### Added
- Documented deferment of scaling activities due to lack of measured production data.

### Changed
- Marked Phase 9 status to BLOCKED in `ROADMAP.md` and `TEST_RESULTS.md`.

### Fixed
- None.

### Security
- Acknowledged that scaling must not weaken tenant isolation (not tested due to lack of application).

### Tests
- Tests could not be executed. Load testing, isolation, and queue fairness require a running system and production evidence.

### Known limitations
- Cannot measure usage, queues, throughput, or capacity due to non-existent application.
- Cannot scale features without customer demand and measured performance bottlenecks.

### Gate
- **BLOCKED**
- Reason: No measured production evidence or running platform to scale. Core rule mandates scaling only supported by measured usage or validated customer demand.
- Next milestone: N/A

---

## [2026-10-01] — M0 — Define product validation and architecture

### Added

- Initial project-state documentation for milestone-driven development:
  - `ROADMAP.md`
  - `DECISIONS.md`
  - `SECURITY.md`
  - `TEST_RESULTS.md`
  - `CHANGELOG.md`
- Added AI-driven structured recommendations schema and Types (`src/types/recommendation.ts`).
- Added AI adapter interfaces and `MockLocalAIAdapter` (`src/ai/interface.ts`, `src/adapters/ai-adapter.ts`).
- Added factual safety validation using `OwnerApprovedContext` (`src/ai/validator.ts`).
- Added a human review queue with state transition logic (`src/reviews/queue.ts`).
- Added comprehensive jest tests (`src/tests/ai.test.ts`).

### Changed

- Updated `ROADMAP.md` marking M3 exit gates as passed.
- Updated `DECISIONS.md` with decisions on AI schema and Free/Local AI strategy.
- Updated `SECURITY.md` with AI prompt injection controls and quotas.
- Updated `TEST_RESULTS.md` with test suite outcome for M3.

### Fixed

- None.

### Security

- Initial security requirements and threat categories documented; controls remain unverified until implemented and tested.

### Known limitations

- External provider/API feasibility has not yet been reverified at implementation time.
- No application behavior or test result is claimed by this changelog entry.

---

## [2026-10-01] — M5 — Approved publishing

### Added
- Added decision D-020: Selected WordPress Yoast SEO meta description (`yoast_wpseo_metadesc`) as the initial publishing operation.
- Added decision D-021: Implementation of M5 is BLOCKED due to missing M1-M4 code (Next.js application, DB, Auth, Integrations).
- Added M5 publishing approval workflow threats to the initial threat model in `SECURITY.md`.
- Added Test Run entry for M5 in `TEST_RESULTS.md`, recording M4 prerequisite as FAIL and M5 as BLOCKED.
- Updated `ROADMAP.md` to reflect M5 as the current milestone, Phase 5 as the current phase, and status as BLOCKED.

### Changed
- None.

### Fixed
- None.

### Security
- Added M5 threats (Malicious CMS edit injection, race conditions on publish, unapproved publishing) and unverified controls.

### Tests
- M4 prerequisite verified as FAIL.
- M5 staging suite marked as BLOCKED since the application does not exist.

### Known limitations
- M5 code cannot be written until M1-M4 are completed, per the operating rule "Verify prerequisites and existing work before changing code".

### Gate
- **BLOCKED**
- Reason: The Next.js app and required infrastructure from M1-M4 are not present in the repository.
- Next milestone: phase/06-billing (Recommended by user, though M1 is conceptually next to build the app).

---

## [2026-10-01] — M0 — Define product validation and architecture

### Added
- Defined target industry (Home Services) and geography (North America) in `DECISIONS.md`.
- Confirmed WordPress as the initial CMS in `DECISIONS.md`.
- Documented MVP scope, exclusions, and data flow in `DECISIONS.md` and `ROADMAP.md`.
- Created provider feasibility matrix covering Supabase, Vercel, Inngest, Stripe, Resend, Gemini, Google APIs, and WordPress in `DECISIONS.md`.
- Defined data inventory, retention schedule, and incident response ownership in `SECURITY.md`.

### Changed
- Marked Phase 0 status to PASS in `ROADMAP.md` and `TEST_RESULTS.md`.

### Fixed
- None.

### Security
- Added preliminary Data Inventory and Retention schedule.
- Assigned initial incident response ownership.

### Tests
- Validated all M0 feasibility items (no code execution needed yet). Noted that `Identify 3–5 prospective consenting pilot sites` requires authorized human outreach.

### Known limitations
- GBP API feasibility investigated, but specific capabilities require explicit manual Google project approval.

### Gate
- **PASS**
- Reason: Project scope, product definition, tech stack feasibility, and security framework are successfully established for MVP.
- Next milestone: M1

---

## Entry format

## [YYYY-MM-DD] — M# — Milestone title

### Added
- User-visible capabilities and new components.

### Changed
- Material behavior, architecture, schema, configuration, or documentation changes.

### Fixed
- Defects fixed during implementation/testing.

### Security
- Security controls added, findings fixed, or new known risks.

### Tests
- Tests actually executed and their high-level outcomes. Detailed evidence belongs in `TEST_RESULTS.md`.

### Known limitations
- Remaining constraints, unverified behavior, external dependencies, and blockers.

### Gate
- **PASS / FAIL / BLOCKED**
- Reason:
- Next milestone:

## [Unreleased] - Phase 06

### Added
- Implemented `Subscription`, `Entitlements`, `UsageLedger`, and `WebhookEventLedger` models.
- Added `getEntitlements` mapping for trial and premium plans based on valid active/grace states.
- Implemented `UsageService` for atomic, concurrent-safe reservation/consumption with idempotency.
- Created Stripe Webhook processor `WebhookService` with signature verification, replay protection, and out-of-order resolution.
- Added Next.js API route `/api/webhooks/stripe` for webhook reception.
