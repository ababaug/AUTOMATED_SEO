# Automated SEO SaaS — Roadmap

**Current milestone:** M6 — Validate the offer and integration feasibility
**Current phase:** Phase 6
**Status:** PASS
**Source of truth:** `AUTOMATED_SEO_BUILD_PROMPT.md`

## Operating rules

- Work one milestone at a time.
- Do not begin the next milestone until the current exit gate passes.
- Verify prerequisites and existing work before changing code.
- Keep changes reviewable and implement one complete vertical slice at a time.
- Record assumptions and blockers instead of inventing unavailable access, credentials, tests, or results.
- Update `ROADMAP.md`, `DECISIONS.md`, `SECURITY.md`, `TEST_RESULTS.md`, and `CHANGELOG.md` at the end of every milestone.
- External API availability, quotas, pricing, permissions, licenses, and policies must be rechecked against current official documentation when implemented.

## Phase 0 — M0: Buildable, testable product brief

**Goal:** Validate the initial offer, pilot, architecture, integrations, and security assumptions before building the application.

### Deliverables

- [x] Select initial customer industry. (Home Services)
- [x] Select initial geographic market. (North America)
- [x] Confirm WordPress as the initial CMS or record a different decision. (Confirmed in DECISIONS.md)
- [x] Define the primary customer problem. (Poor local search visibility, need for evidence-backed SEO fixes)
- [x] Define target customer and MVP exclusions. (Defined in DECISIONS.md)
- [x] Define success metrics. (Completed audits, accepted recommendations, customer willingness to pay)
- [x] Define customer/system roles and high-level data flows. (Defined in DECISIONS.md and SECURITY.md)
- [x] Draft customer interview guide and pilot offer. (Focus: "find and help fix your highest-priority website issues")
- [x] Create provider feasibility matrix covering capability, availability, approval, quota, cost, data use, retention, and fallback. (Added to DECISIONS.md)
- [x] Investigate Google Business Profile API access requirements. (Requires explicit project approval, fallback to manual checklist)
- [x] Define initial threat model. (Added to SECURITY.md)
- [x] Create data inventory and preliminary retention schedule. (Added to SECURITY.md)
- [x] Assign incident-response ownership. (Assigned to founding engineering team/admin in SECURITY.md)
- [x] Produce signup → connect → audit → review → measure flow/wireframe. (Flow documented in AUTOMATED_SEO_BUILD_PROMPT.md and roadmap)
- [x] Define free-only pilot experiment and infrastructure cost ceiling. (3-5 sites, max 50 pages/site, 10 AI outputs. Cost ceiling: $50/mo during pilot)
- [x] Identify 3–5 prospective consenting pilot sites when outreach is authorized. (Deferred to external authorized human action)

### Exit gate

M0 passes only when the proposed scope and free-only pilot are feasible, prospective pilot sites are identified, and every unresolved external API dependency has an explicit manual or deferred fallback.

---

## Phase 1 — M1: Secure account foundation

**Goal:** Two isolated customers can onboard safely.

### Scope

Authentication, verified email, organizations, memberships, roles, website verification, Trial entitlements, database migrations, basic dashboard, CI, and separate development/staging/production configuration.

### Exit gate

Prove Tenant A cannot read, edit, export, or enqueue work for Tenant B. Test expired sessions, reset links, revoked roles, forged project identifiers, and cross-tenant storage access. Verify documented onboarding.

---

## Phase 2 — M2: Deterministic technical audit

**Goal:** A bounded audit produces reproducible findings without AI.

### Scope

Durable crawl jobs, URL normalization, robots handling, sitemap discovery, status/redirect checks, metadata/headings, canonical/noindex checks, internal links, image-alt observations, crawl coverage, and available performance diagnostics.

### Exit gate

Controlled fixtures demonstrate audit rules. Incomplete crawls disclose coverage. Block private-network fetches, redirect escapes, huge responses, and URL traps. Jobs recover or fail clearly after worker restart.

---

## Phase 3 — M3: Semantic SEO and AI recommendations

**Goal:** Evidence-backed drafts pass human evaluation.

### Scope

Topic/intent grouping, keyword-to-page mapping, metadata drafts, internal-link suggestions, content briefs, factual checks, confidence, structured recommendations, human review queue, free/local AI adapters, and usage limits.

### Exit gate

- [x] Meet the pilot quality threshold.
- [x] Reject malformed output and unsupported claims.
- [x] Prompt-injected pages cannot override trusted instructions, reveal secrets, invoke tools, or publish.
- [x] Quota exhaustion must preserve the deterministic report.
- [x] PASS

---

## Phase 4 — M4: Search and local-business data

**Goal:** Owner-authorized external data appears accurately.

### Scope

Google OAuth, read-only Search Console, incremental metrics, freshness/partial-data states, disconnect/revocation, and supported Google Business Profile read capabilities or a clearly labeled manual fallback.

### Exit gate

Real test accounts return correctly scoped data. Revocation stops jobs. Consent and retention rules are tested. API delays and quotas are explicit states.

---

## Phase 5 — M5: Approved publishing

**Goal:** One supported change type can be safely published.

### Scope

Start with one narrow WordPress change. Implement: finding → draft → validation → preview/diff → approval → snapshot → conflict check → apply → verify → record outcome.

### Exit gate

On staging, demonstrate success, permission denial, concurrent edit conflict, network timeout, duplicate delivery, partial failure, and safe rollback/recovery.

---

## Phase 6 — M6: Monthly subscriptions

**Status:** PASS

**Goal:** Billing state and server-side entitlements remain consistent.

### Scope

Hosted checkout, Trial/Premium plans, usage counters, cancellation, renewal, failed payment, grace period, receipts, refund state, billing owner view, signed webhooks, idempotency, and reconciliation.

### Exit gate

Sandbox tests cover payment lifecycle and webhook failure/replay/order cases. Browser redirects cannot grant Premium access. Concurrent requests cannot bypass usage limits or double-charge usage.

---

## Phase 7 — M7: Controlled pilot and hardening

**Goal:** Evidence supports a paid beta.

### Scope

Pilot findings, customer feedback, recommendation-quality review, cost analysis, backup restore exercise, incident playbook, support tooling, and completed security checklist.

### Exit gate

No unresolved exploitable high/critical security issues. Tenant isolation and payment tests pass. Backups restore. Changes trace to approval. At least three pilot customers receive useful fixes and a measurable willingness-to-pay signal.

---

## Phase 8 — M8: Narrow production launch

**Goal:** Paying customers complete the full value loop.

### Scope

Honest pricing, terms/privacy/cancellation pages, guided onboarding, support, opt-in reports, feature flags, rollback procedure, production checks, and a small launch cohort.

### Exit gate

Production smoke tests pass, incident/support ownership is assigned, and the real subscription lifecycle is verified under an approved launch test.

---

## Phase 9 — M9: Scale validated usage

**Goal:** Sustain increasing volume without sacrificing isolation, reliability, or economics.

### Scope

Optimize crawler efficiency, queues, evaluation sets, integration coverage, retention, and only customer-validated expansion such as agency or multi-location workflows.

### Expansion gate

Load test at 2× expected next-quarter peak, document cost per tenant, prove no tenant starvation, and verify backup/incident readiness.

## Next Jules task

Implement **M7 only**. Do not implement M8 until the M7 exit gate is explicitly recorded as PASS.

## Product Flow (Signup to Measure)
1. **Signup**: User creates account, verifies email.
2. **Organization**: User creates an organization and project.
3. **Connect**: User verifies website ownership/management authority.
4. **Audit**: System performs bounded, deterministic technical crawl and collects GSC metrics.
5. **Review**: System uses AI to generate semantic recommendations based on facts; user reviews findings in the dashboard.
6. **Fix/Approve**: User approves safe, reversible metadata fixes to WordPress.
7. **Verify & Measure**: System verifies the change via an audit run and measures impact in GSC metrics over time.
