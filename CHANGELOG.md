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

---

## [2026-10-01] — M0 — Validate the offer and integration feasibility

### Added
- Created `PHASE_0_REPORT.md` defining customer segment (HVAC/Florida), MVP scope, product journey, pilot design, and provider feasibility matrix.

### Changed
- Updated `DECISIONS.md` to move D-001, D-003, D-007, D-010 to ACCEPTED.
- Updated `ROADMAP.md` checking off all M0 deliverables.
- Updated `TEST_RESULTS.md` setting M0 validation checks to PASS.

### Security
- Added Data Inventory, Retention Schedule, and Incident Response ownership to `SECURITY.md`.

### Tests
- Validated M0 assumptions visually and conceptually. No code tests to run yet.

### Known limitations
- External provider/API availability/prices (e.g. Stripe, Gemini) have been assumed based on September 2026 data and need to be implemented/verified dynamically in future phases.

### Gate
- **PASS**
- Reason: The proposed scope, provider matrix, and free-only pilot are documented and feasible. Unresolved external dependencies have documented manual fallbacks.
- Next milestone: M1 — Secure account foundation

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
