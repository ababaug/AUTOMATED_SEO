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

## [Phase 7] - M7 Controlled Pilot and Hardening (BLOCKED)

### Added
- Added Incident Response Playbook to `SECURITY.md`.
- Drafted M7 requirements in `TEST_RESULTS.md` and `DECISIONS.md`.

### Blocked
- M7 implementation is blocked. Precondition "Verify M6 is PASS and accepted on main" failed because the codebase is currently at M0. M1-M6 must be completed first.
