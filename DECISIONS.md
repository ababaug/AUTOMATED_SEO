# Automated SEO SaaS — Decision Log

This file records architectural and product decisions. Do not silently turn assumptions into decisions. For provider/API decisions, record the source and verification date when the decision is made.

## Status vocabulary

- **PROPOSED** — Working assumption requiring validation.
- **ACCEPTED** — Deliberately selected and supported by current evidence.
- **DEFERRED** — Intentionally postponed.
- **REJECTED** — Considered and not selected.
- **SUPERSEDED** — Replaced by a later decision.

---

## D-001 — Initial product focus

**Status:** PROPOSED  
**Decision:** Begin with local service businesses that already have a WordPress website and an eligible Google Business Profile. Select one industry and one geographic market after customer discovery.  
**Reason:** Keeps the first pilot narrow enough to evaluate useful fixes, integrations, costs, and customer demand.  
**Open items:** Industry and geography are not yet selected.

## D-002 — Initial product differentiator

**Status:** PROPOSED  
**Decision:** Prioritize evidence-backed, understandable, reviewable SEO fixes over high-volume AI content generation.  
**Reason:** The product should help customers understand what is wrong, why the finding exists, what to fix first, and what changed after a fix.

## D-003 — Application architecture

**Status:** PROPOSED  
**Decision:** Start with a modular TypeScript/Next.js application, PostgreSQL, private object storage, and a dedicated durable job worker/queue. Avoid microservices until measured requirements justify them.  
**Constraints:** Authorization must be server-side. Long crawls and AI work must run outside web-request lifetimes.

## D-004 — Tenant ownership model

**Status:** PROPOSED  
**Decision:** Every tenant-owned record carries an organization identifier, with tenant-aware joins/foreign keys and integration tests for privileged worker access.  
**Roles:** Customer owner, editor, viewer; system administrators remain separate.

## D-005 — AI strategy

**Status:** PROPOSED  
**Decision:** Deterministic rules handle directly observable technical findings. AI is reserved for explanation, semantic grouping, content briefs, and proposed rewrites. AI providers are accessed through a validated provider interface.  
**Pilot constraint:** `PAID_AI_ENABLED=false`. Provider failure must not prevent delivery of deterministic audit results.

## D-006 — AI input/output trust

**Status:** PROPOSED  
**Decision:** Crawled pages and model output are untrusted data. Structured model output must be validated before storage/display/use. Customer-facing changes require human approval by default.

## D-007 — Website crawling

**Status:** PROPOSED  
**Decision:** Use an HTTP parser first and isolated browser rendering only when necessary. Enforce crawl budgets, per-host concurrency, explicit timeouts, safe redirects, restricted egress, and SSRF defenses on every fetch.

## D-008 — Google integrations

**Status:** PROPOSED  
**Decision:** Search Console begins read-only. Google Business Profile functionality is limited to currently supported, approved capabilities; unavailable access receives a manual workflow rather than a simulated integration.  
**Verification required:** Recheck current official Google documentation at implementation time.

## D-009 — Publishing

**Status:** PROPOSED  
**Decision:** Start with one narrow, reversible WordPress metadata change type. Every change follows draft → validation → diff → approval → snapshot → conflict check → apply → verify → audit record.

## D-010 — Billing

**Status:** PROPOSED  
**Decision:** Use hosted payment collection. Server-verified signed webhooks and reconciliation are authoritative for entitlements; browser redirects never grant Premium access.  
**Provider:** UNDECIDED. Evaluate availability for the actual business country, currencies, settlement, recurring billing, disputes, and fees.

## D-011 — Trial hypothesis

**Status:** PROPOSED  
**Decision:** Test a 14-day no-card Trial with one verified site, one bounded audit, up to 10 AI drafts, and no automatic publishing.

## D-012 — Premium pricing hypothesis

**Status:** PROPOSED  
**Decision:** Test $149/month for one business website and one eligible location with explicit usage caps.  
**Note:** This is a willingness-to-pay hypothesis, not validated pricing.

## D-013 — Deferred scope

**Status:** ACCEPTED FOR INITIAL PLANNING  
**Decision:** Defer agency white labeling, many CMS integrations, automated backlink outreach, daily rank grids, unrestricted article generation, customer-facing GBP automation APIs, international SEO suites, and custom AI model training until retention/demand supports them.

---

## Decision template

### D-XXX — Title

**Status:** PROPOSED / ACCEPTED / DEFERRED / REJECTED / SUPERSEDED  
**Date:** YYYY-MM-DD  
**Milestone:** M#  
**Decision:**  
**Reason/evidence:**  
**Alternatives considered:**  
**Security/privacy impact:**  
**Cost/operational impact:**  
**External source and verification date (if applicable):**  
**Follow-up/reversal condition:**
