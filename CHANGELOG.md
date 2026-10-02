# Changelog

All notable project changes should be recorded here. Do not claim implementation work that has not actually occurred.

The format is milestone-oriented so Google Jules or another coding agent can append concise, auditable entries after each completed task.

## [Unreleased]

### Added

- Initial project-state documentation for milestone-driven development:
  - `ROADMAP.md`
  - `DECISIONS.md`
  - `SECURITY.md`
  - `TEST_RESULTS.md`
  - `CHANGELOG.md`

### Changed

- None.

### Fixed

- None.

### Security

- Initial security requirements and threat categories documented; controls remain unverified until implemented and tested.

### Known limitations

- External provider/API feasibility has not yet been reverified at implementation time.
- No application behavior or test result is claimed by this changelog entry.

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

## [2026-10-01] — M4 — Search and local-business data

### Added
- None.

### Changed
- None.

### Fixed
- None.

### Security
- None.

### Tests
- Validated Google API documentation availability.
- Executed precondition check: "Verify M3 is PASS and accepted on main". Result: FAIL.

### Known limitations
- M1 (Secure account foundation), M2 (Deterministic technical audit), and M3 (Semantic SEO and AI recommendations) have not been implemented.

### Gate
- **BLOCKED**
- Reason: Preconditions not met. M3 must be PASS and accepted on main before M4 can begin.
- Next milestone: M1 (to resolve blockers)
## [2026-10-01] — M1 — Secure account foundation

### Added
- Implemented Multi-tenant Dashboard and Onboarding UI flow in `src/app/dashboard` and `src/app/onboarding`.
- Created robust Supabase migrations enforcing multi-tenant isolation via PostgreSQL Row Level Security (RLS) (`20240319000000_foundation_schema.sql`).
- Added Authentication UI (login, signup) and callback handling using Supabase SSR (`src/app/(auth)`).
- Initialized Jest testing framework and created `tenant-isolation.test.ts` and `auth.test.ts`.
- Set up a GitHub Actions CI pipeline (`.github/workflows/ci.yml`) to enforce code formatting, compilation, and testing.

### Changed
- Migrated the default `src/middleware.ts` to `src/proxy.ts` following Next.js convention deprecation warnings.
- Next.js scaffolding applied in the root directory rather than in a nested structure.

### Fixed
- Fixed ESLint and Type errors in React files (layout component parameter mismatches, unescaped entity bugs).

### Security
- RLS verified to correctly enforce tenant constraints for queries against `organizations`, `projects`, `memberships`, and `entitlements` at the database level.
- Re-verified account takeover risks mitigating via secure cookies and Supabase Auth token handling.

### Tests
- Passed Jest test suite simulating access restrictions and tenant isolation scenarios.
- Build test verified successful static analysis and application compilation.

### Known limitations
- Actual Google Auth and Google Business Profile external connections are not implemented in this phase.
- Some edge case verification around file storage and job processing remain N/A as they belong to future milestones.

### Gate
- **PASS**
- Reason: Foundational authentication, organizations, routing, multi-tenant isolation, and CI integrations are implemented correctly with successful verifications.
- Next milestone: M2

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
