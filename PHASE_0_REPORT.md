# Automated SEO SaaS — Phase 0 Report

## 1. Repository State Analysis
- **Existing application/code**: None. The repository currently only contains project specification and documentation files (`AUTOMATED_SEO_BUILD_PROMPT.md`, `ROADMAP.md`, `DECISIONS.md`, `SECURITY.md`, `TEST_RESULTS.md`, `CHANGELOG.md`).
- **Frameworks & Dependencies**: None installed.
- **Configuration**: None.
- **Missing prerequisites**: Node.js/npm (to be defined in Next.js initialization in Phase 1), PostgreSQL instance, Stripe/payment provider account, Auth provider setup, Object Storage (e.g., AWS S3).

## 2. Strategic Definitions
- **Initial Customer Segment**: HVAC (Heating, Ventilation, and Air Conditioning) businesses.
- **Initial Geographic Market**: Florida, US.
- **Initial CMS**: WordPress.
- **Primary Customer Problem**: HVAC businesses in Florida struggle to identify why they aren't ranking well locally on Google, lack clear understanding of specific website defects, and do not know which fixes are safest and most impactful to implement first.
- **MVP Inclusions**:
  - Email-verified account creation, login, organization membership.
  - One account lifecycle (Trial -> Premium).
  - Secure property connection and website verification.
  - Bounded technical crawling (rules-based).
  - Semantic recommendations and AI drafts with evidence.
  - Google Search Console read-only connection.
  - Google Business Profile manual readiness checklist.
  - Review queue for manually applied fixes.
  - Monthly subscription billing (hosted checkout).
- **MVP Exclusions**:
  - Agency white labeling, multi-location workflows.
  - Automated backlink outreach.
  - Daily rank grids.
  - Unrestricted article generation.
  - Customer-facing GBP automation APIs.
  - International SEO suites.
  - Custom AI model training.
  - Other CMS integrations (Shopify, Wix, etc.).
- **Trial Assumptions**: 14 days, no credit card required, 1 verified site, 1 bounded audit, up to 10 AI drafts, no automatic publishing.
- **Premium Hypothesis**: $149/month for 1 business website and 1 eligible GBP location, with explicit usage caps.
- **Success Metrics**:
  - Validated willingness to pay (e.g., 25% demo-to-paid conversion).
  - Activation rate (verified site + completed audit + 1 reviewed useful recommendation).
  - Retention rates at 30, 60, and 90 days.
  - Cost per completed audit and inference spend limits.

## 3. Product Journey
**Signup → Organization → Connect → Audit → Review → Measure**
1. **Signup**: Customer creates account and verifies email.
2. **Organization**: Customer sets up their business profile in the app.
3. **Connect**: Customer inputs WordPress site URL and verifies ownership; connects Google Search Console (read-only).
4. **Audit**: System performs bounded crawl and technical rule-based analysis. AI generates semantic recommendations based on evidence.
5. **Review**: Customer reviews prioritized, evidence-backed findings. Approves draft fixes (metadata changes).
6. **Approved Fix**: (Manual application initially, WordPress plugin integration later).
7. **Verification**: System checks if the fix was applied successfully.
8. **Measure**: Monitor Google Search Console metrics over 6-8 weeks for changes.

## 4. Architecture Evaluation
- **TypeScript & Next.js**: Ideal for web app and server, allowing unified codebase, React components, and server-side logic/API routes.
- **PostgreSQL**: Excellent for relational data, tenant-scoped records, and usage ledgers.
- **Established Authentication**: e.g., Supabase Auth or Auth0 (to be finalized in Phase 1).
- **Organization-based Tenancy**: Essential for isolation.
- **Background Workers & Durable Queue**: e.g., Inngest or Trigger.dev to run long crawls and AI jobs outside web requests.
- **AI Provider Abstraction**: Using standard API adapters to easily switch between Gemini Free Tier and paid models later.
- **Private Object Storage**: e.g., AWS S3 or Cloudflare R2 for storing audit reports/snapshots.
- **Hosted Billing**: Stripe Checkout for seamless, secure recurring payments.

## 5. Provider Feasibility Matrix

| Capability | Provider | Availability | Approval | Quota | Cost | Data Usage/Retention | Fallback | Verify Date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Authentication | Supabase | Global | None | 50K MAU (Free) | $0 to start | Standard | NextAuth.js | 2026-09-28 |
| Database | Supabase (PG) | Global | None | 500MB (Free) | $0 to start | Retained until deleted | Hosted RDS | 2026-09-28 |
| Hosting | Vercel | Global | None | Standard limits | $0 (Hobby)/$20 Pro | Logs 1-3 days | Render/Heroku | 2026-09-28 |
| Queue/Jobs | Inngest | Global | None | 100K runs/mo | $0 to start | 7 days retention | Custom PG Queue | 2026-09-28 |
| Email | Resend | Global | Domain verify | 3K/mo | $0 to start | Retained for logs | SendGrid | 2026-09-28 |
| Storage | Cloudflare R2 | Global | None | 10GB/mo | $0 to start | Tenant-controlled | AWS S3 | 2026-09-28 |
| AI | Gemini (Free Tier) | Global (most) | None | 15 RPM, 1M TPM | $0 | Used for model training (Caution) | Local model | 2026-09-28 |
| Search Console | Google API | Global | OAuth consent | Site-specific | $0 | Governed by Google | Manual export | 2026-09-28 |
| Business Profile | Google API | Global | App approval | Limited | $0 | Strict Google limits | Manual checklist | 2026-09-28 |
| WordPress | REST API | Per site | Site admin | N/A | $0 | On-site | Manual instructions | 2026-09-28 |
| Billing | Stripe | US (Florida) | Account verify | N/A | ~2.9% + 30¢ | Stripe retention | None | 2026-09-28 |

**Google Business Profile API Access Requirements**:
Requires creating a GCP Project, enabling the Google Business Profile API, and applying for access via the GBP API request form. Pending approval, functionality will fall back to a manual readiness checklist and owner-supplied information workflow.

## 6. Pilot Design and Experiment
- **Pilot Size**: 3–5 sites (consent required).
- **Audit Limits**: 25-50 public HTML pages per site. Max 10 AI recommendations per audit.
- **Feature Flag**: `PAID_AI_ENABLED=false` (using Gemini Free Tier or fallback).
- **Infrastructure Cost Ceiling**: $50/month (Founder-approved budget before provisioning paid services).
- **Measurements**:
  - Quality: >90% materially correct and actionable recommendations (human labeled).
  - Cost: Cost per completed audit, tokens per recommendation.
  - Demand: Willingness to pay at end of pilot.
- **Pilot Prospects**: (Placeholders until outreach authorized)
  - HVAC Site A (Florida)
  - HVAC Site B (Florida)
  - HVAC Site C (Florida)

## 7. Customer Interview Guide (Draft)
1. How do you currently find out if your website has technical or SEO problems?
2. What happens when you try to fix these problems?
3. How much time do you spend managing your Google Business Profile?
4. If a tool could identify exact SEO issues and draft the fixes for you to review, how much would that be worth to your business?
5. (Demo wireframe/flow) What is confusing about this process?

## 8. Roles & High-Level Data Flows
- **Customer Roles**: Owner (manage billing/settings), Editor (approve changes), Viewer (read-only).
- **System Roles**: Administrator (support/diagnostics), Worker (background jobs).
- **Data Flows**:
  - User -> OAuth/Email Auth -> Session Token.
  - Worker -> Fetch Site -> Raw HTML -> S3/Database.
  - Worker -> Rules Engine -> Audit Findings -> Database.
  - Worker -> AI Provider -> Draft Recommendations -> Database.
  - User -> Dashboard -> Approve Change -> Worker -> Target Site / Manual Instructions.
