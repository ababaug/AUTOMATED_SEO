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
**Open items:** Addressed by D-014.

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

## D-014 — Initial target industry and geography

**Status:** ACCEPTED
**Date:** 2026-09-28
**Milestone:** M0
**Decision:** Target local service businesses in the Home Services sector (e.g., HVAC, plumbing, electrical) operating in North America.
**Reason/evidence:** Home service businesses heavily rely on local search visibility, have defined service areas that match Google Business Profile mechanics, and often have budget to solve lead-generation problems.
**Alternatives considered:** Real estate, medical practices, law firms (rejected initially due to higher compliance/regulatory risk).
**Security/privacy impact:** Low. Standard B2B SaaS requirements apply.
**Cost/operational impact:** Low.
**Follow-up/reversal condition:** If customer discovery interviews yield low willingness-to-pay, pivot to a different segment.

## D-015 — Selected CMS for initial pilot

**Status:** ACCEPTED
**Date:** 2026-09-28
**Milestone:** M0
**Decision:** WordPress will be the only supported CMS for the initial pilot and automated publishing capabilities.
**Reason/evidence:** Vast market share for local business sites, existing plugin ecosystem (e.g., Yoast, RankMath) that provides predictable metadata structures, and requested via original prompt constraint.
**Alternatives considered:** Shopify, Wix, Squarespace (deferred for later milestones).
**Security/privacy impact:** Requires robust authentication and input validation before sending changes to customer WordPress sites.
**Cost/operational impact:** Need to maintain integration code specifically for WordPress metadata APIs.
**Follow-up/reversal condition:** If WordPress plugin fragmentation proves too difficult to reliably integrate with, reassess scope.

## D-016 — Provider Feasibility Matrix

**Status:** ACCEPTED
**Date:** 2026-09-28
**Milestone:** M0
**Decision:** Selected default stack components based on capability matching requirements.
- **Hosting/Framework:** Vercel (Next.js, TypeScript). Capability: compute/serving. Availability: Generally Available. Approval: Automatic. Quota: 100GB bandwidth (free tier). Cost: $0 initially. Data Usage: Ephemeral. Retention: N/A. Fallback: self-hosted Node server. Verified: 2026-10-01.
- **Database:** Supabase (PostgreSQL). Capability: multi-tenant DB, Auth. Availability: Generally Available. Approval: Automatic. Quota: 500MB DB (free). Cost: $0 initially. Data Usage: Persistent storage. Retention: Customer controlled. Fallback: bare-metal Postgres. Verified: 2026-10-01.
- **Storage:** Supabase Storage. Capability: private object storage. Availability: Generally Available. Approval: Automatic. Quota: 1GB (free). Cost: $0 initially. Data Usage: Persistent. Retention: Customer controlled. Fallback: AWS S3. Verified: 2026-10-01.
- **Jobs/Queue:** Inngest. Capability: durable background queues. Availability: Generally Available. Approval: Automatic. Quota: 100,000 events/mo (free). Cost: $0 initially. Data Usage: Ephemeral job state. Retention: 7 days. Fallback: custom Postgres-backed queue. Verified: 2026-10-01.
- **Billing:** Stripe. Capability: subscriptions. Availability: Generally Available (US). Approval: Business Verification Required. Quota: Unlimited. Cost: 2.9% + 30c per tx. Data Usage: Payment records. Retention: 7 years. Fallback: Lemonsqueezy. Verified: 2026-10-01.
- **Email:** Resend. Capability: transactional emails. Availability: Generally Available. Approval: Domain verification. Quota: 3,000/mo (free). Cost: $0 initially. Data Usage: Email content. Retention: 30 days log. Fallback: SendGrid. Verified: 2026-10-01.
- **AI Inference:** Google Gemini API. Capability: semantic grouping. Availability: Generally Available. Approval: Automatic (Free Tier). Quota: 15 RPM. Cost: $0 initially. Data Usage: Inference (Google may use free tier data). Retention: Varies. Fallback: local Llama-based model. Verified: 2026-10-01.
- **Search Data:** Google Search Console API. Capability: read-only metrics. Availability: Generally Available. Approval: OAuth consent. Quota: 1,200,000,000 QPD. Cost: $0. Data Usage: Metrics cache. Retention: 30 days max cache. Fallback: N/A. Verified: 2026-10-01.
- **Local Business:** Google Business Profile API. Capability: read initially, limited write later. Availability: Generally Available. Approval: **Requires explicit Google project approval.** Quota: Basic tier. Cost: $0. Data Usage: Business profile info. Retention: Max 30 days cache. Fallback: manual checklist. Verified: 2026-10-01.
**Reason/evidence:** Proven reliable vendors that integrate well with the Next.js ecosystem.
**Security/privacy impact:** All vendors require careful credential management (secrets not in repo) and data retention policy alignment.
**Follow-up/reversal condition:** If a vendor significantly changes pricing, quotas, or terms of service, alternative providers must be substituted.

## D-017 — Preliminary Data Model

**Status:** ACCEPTED
**Date:** 2026-09-28
**Milestone:** M0
**Decision:** Core entities will be users, organizations, memberships (linking users and organizations with roles), projects (websites), verified properties (OAuth linkages), integrations, subscriptions, entitlements, usage ledgers, audit runs, page observations, findings, recommendations, approvals, change sets, job attempts, metric snapshots, and audit events.
**Reason/evidence:** Supports strict multi-tenant isolation via the `organization_id` foreign key.
**Security/privacy impact:** RLS policies in Supabase must enforce isolation based on `organization_id`.

## D-018 — MVP Scope and Exclusions

**Status:** ACCEPTED
**Date:** 2026-09-28
**Milestone:** M0
**Decision:**
**Inclusions:** Authenticated accounts, website verification, bounded automated crawls, rule-based tech audit, AI-powered semantic review of observed evidence, GSC metrics, manual checklist for GBP, secure automated publishing of single WordPress metadata fields.
**Exclusions (Deferred):** Fake reviews, review gating, link building schemes, automated bulk content generation, agency white-labeling, automated GBP writes without explicit access.
**Reason/evidence:** Focuses on the core value loop of discovering issues, proposing evidence-backed fixes, applying them safely, and observing changes.

## D-019 — Pilot Measurements and Pricing Hypothesis

**Status:** ACCEPTED
**Date:** 2026-10-01
**Milestone:** M0
**Decision:**
**Quality Measurements:** Minimum 90% actionable recommendations, zero unsupported claims, zero unapproved changes.
**Cost Measurements:** Cost per completed audit, AI tokens per recommendation, infrastructure cost ceiling of $50/mo during pilot.
**Customer/Feedback Measurements:** Number of fixes accepted/applied, processing time, stated willingness to pay.
**Trial Assumption:** 14 days, no card, 1 site, bounded audit, 10 AI drafts, no auto publishing.
**Premium Hypothesis:** $149/mo for 1 business site and 1 location with capped pages/audits.
**Reason/evidence:** Sets clear measurable bounds for the free pilot to ensure cost control and clear success/failure metrics.
**Follow-up/reversal condition:** Adjust premium hypothesis if customer interviews show lower/higher willingness to pay.

## D-020 — Defer Scaling until Production Measurement

**Status:** ACCEPTED
**Date:** 2026-10-01
**Milestone:** M9
**Decision:** All technical scaling and architecture expansion (M9) is deferred. We will not scale features, queues, workers, databases, or architectures until there is measured production usage and validated customer demand.
**Reason/evidence:** Project core rule: "DO NOT scale features merely because they are technically possible." Currently, there is no application code, no production workload, and no measurable capacity usage. Optimization without measured bottlenecks is blind and wastes resources.
**Security/privacy impact:** Preserves current security baseline and tenant isolation model without adding unnecessary complexity.
**Cost/operational impact:** Saves infrastructure costs by avoiding premature capacity expansion.
**Follow-up/reversal condition:** Implement capacity and reliability scaling *only after* production load demonstrates clear performance bottlenecks or customer volume necessitates expansion.
