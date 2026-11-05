# KARMA ULTRA MAX — Multi-site Upgrade Program

Updated: 2026-11-05  
Owner: vishwasaithalz  
Purpose: evolve the existing website portfolio into distinct, useful products with measurable workflows, without flattening their identities into one generic template.

## Operating rules

1. Preserve each project's existing identity, architecture, content, data and canonical production destination.
2. Inspect current source and deployment before editing. Make focused commits; do not replace an application wholesale with a generic landing page.
3. Preserve private visibility for Build Journal and the KARMA Control Center. Keep noindex directives on private dashboards.
4. NetMirror's public production host remains Cloudflare at netmirror.fit. Vercel is preview-only.
5. NOSTALGIA.EXE work is Instagram-first. Do not publish or schedule social content without the established approval process. Facebook remains excluded.
6. CyberPlayground is on hold. Preserve its approved graphite/muted-blue theme and do not alter its source or deployment until the hold is lifted.
7. Build Journal keeps one canonical project/deployment and its existing daily categorized journal automation. Do not create a second journal or make it public.
8. Quora workflows remain human-reviewed. No login automation, unofficial write APIs, captcha bypass, spam, fake engagement or unattended publishing.
9. Never invent live metrics, question URLs, analytics, customer reviews, integrations, or successful verification.
10. Do not change existing automations or schedules as a side effect of a website upgrade.

## Portfolio inventory and intended product direction

| Project / site | Product direction | ULTRA MAX feature targets | Guardrails |
|---|---|---|---|
| KARMA Control Center | Private command centre | Unified project inventory, deployment health, task board, release log, incidents, link checker, changelog, exportable reports | Private, noindex; preserve existing routes |
| Build Journal | Private engineering journal | Article workspace, category filters, source notes, per-article SEO checklist, schema validation, image manifest, internal-link audit, release timeline | Private, one canonical deployment; retain daily journal automation |
| NetMirror | Public discovery/content site | Search and filters, watchlist/favourites, content metadata, accessibility, structured data, performance improvements, feed health | Cloudflare production at netmirror.fit; Vercel preview only |
| YYYH / YinYangYoHackers | Cybersecurity and AI publication | Topic hubs, article search, learning tracks, tool directory, source citations, glossary, FAQ, author pages, SEO metadata, newsletter-ready content | Ethical/authorized security education; no unsupported claims |
| NOSTALGIA.EXE public | Nostalgia editorial brand | Archive, decade/category filters, media cards, accessible player, credits, captions, social-ready metadata | Do not auto-publish or schedule content |
| NOSTALGIA social dashboard | Private content operations | Media library, unique asset manifest, caption/hashtag editor, calendar, approval queue, publication log, Metricool handoff | Instagram-only; private; approval gates; Facebook excluded |
| KARMA CUT LAB | Hair style exploration | Upload guidance, 12-style gallery, per-style comparison, saved looks, responsive controls, clear preview disclaimers | Preserve real-photo accuracy; no misleading promise of AI try-on unless working provider is configured |
| Cybersecurity Simulator | Safe learning environment | Guided labs, hint system, progress, glossary, scenario reset, completion tracking, defensive explanations | Local/sandboxed learning; authorized use only |
| Recon Lite | Security header review | Header parsing, severity explanations, remediation snippets, before/after comparison, exportable report, privacy-first local analysis | No claims of a full penetration test; no target scanning without authorization |
| Flagship API | API explorer | Endpoint catalogue, schema/examples, request builder, response viewer, environment presets, copyable snippets, error guide | Never expose secrets; use safe demo endpoints |
| Download Manager | File workflow utility | Queue, validation, progress where supported, history, filename rules, batch planning, clear failure states | Respect source-site terms and copyright; do not bypass restrictions |
| Quora Answer Studio | Research and drafting | Research queue, source validation, answer templates, editorial checks, drafts and analytics ledger | Human final posting; no unofficial Quora write integration |
| Design Gallery | Design-system showcase | Component catalogue, live theme tokens, responsive previews, accessibility checks, copyable patterns | Preserve existing deployment protection |
| Next.js Boilerplate / Forge | Reusable developer product | Theme/token editor, accessible component previews, copyable code, starter recipes, tests and documentation | Keep reusable engineering foundation distinct from public brands |
| LogSentry | GitHub-only security utility | Log parsing, rule-based detection, redaction, incident summaries, sample datasets and tests | Do not invent SIEM integrations or upload sensitive logs by default |
| AI-Automation-Lab | GitHub-only automation lab | Workflow recipes, prompt testing, reusable agents, runbooks, evaluation datasets and observability | Secrets stay server-side; human approvals for external side effects |
| Private dashboards | Operational workspaces | Secure authentication, data export, audit trail, responsive UI | Never expose private data or disable access protection |

## Cross-site quality baseline

- Mobile-first responsive layout; semantic HTML; keyboard navigation; visible focus; accessible labels and contrast.
- Useful empty, loading, error, success and offline states for every interactive feature.
- No dead buttons. Each visible control must perform its stated action.
- Search and filters must work on the actual content, not sample placeholders alone.
- Clear privacy notices and data-retention behavior for uploads and local storage.
- SEO only on intended public pages: unique titles/descriptions, canonical URLs, sitemap, robots rules, breadcrumbs and relevant structured data.
- Private dashboards: noindex/nofollow and access protection; never include private content in public sitemaps.
- Performance: responsive images, lazy loading below the fold, minimized scripts, stable layout and measured Core Web Vitals.
- Security: server-side secrets, input validation, safe output encoding, least privilege, dependency review and no secret leakage.
- Testing: build, lint, unit tests where available, route checks, responsive review, accessibility checks and production smoke tests.
- Documentation: README, feature map, environment example, operations runbook, known limitations and release notes.

## Delivery sequence

### Wave 0 — Inventory and protection
- Confirm canonical repo, Vercel project, production alias, visibility and hosting for each site.
- Record current commit and deployment before changes.
- Mark held, private, preview-only and approval-gated projects.
- Identify source repositories for Vercel projects that are not Git-connected.

### Wave 1 — Core product quality
- Prioritize YYYH, Recon Lite, Flagship API, Next.js Forge and Download Manager.
- Implement real functionality in the existing architecture, not static mock cards.
- Add tests and docs with each feature.

### Wave 2 — Content and creative products
- Improve NOSTALGIA.EXE public archive and its private Instagram dashboard.
- Improve NetMirror in its Cloudflare source/hosting workflow.
- Upgrade KARMA CUT LAB after verifying its current provider and image pipeline.
- Preserve the single private Build Journal.

### Wave 3 — Integration and observability
- Add only supported connectors with explicit permission and least privilege.
- Connect project status and release information to the private Control Center.
- Add scheduled checks only when they do not duplicate or alter existing automations.
- Record real analytics only when an analytics source is connected.

## Verification and release checklist

For every release:
- [ ] Correct repository and branch confirmed
- [ ] Existing commit and deployment recorded
- [ ] Build and lint pass
- [ ] Tests pass or gaps explicitly documented
- [ ] Main routes and assets return successfully
- [ ] Interactive controls tested
- [ ] Mobile and keyboard checks completed
- [ ] Privacy and robots behavior verified
- [ ] Production/preview destination confirmed
- [ ] Deployment READY and correct alias verified
- [ ] Rollback reference recorded
- [ ] GitHub commit and release notes linked

## Current known limitations

- The current Vercel inventory lists 17 projects. A project existing in Vercel does not prove its public route is healthy or that its source is Git-connected.
- NetMirror's Cloudflare production source is not managed through the Vercel deployment workflow.
- Some projects may have Vercel deployments without an identifiable GitHub source in the current connection.
- Browser-authenticated/private deployments cannot be considered publicly verified by unauthenticated inspection.
- Feature targets above are a roadmap, not a claim that every feature is already implemented.
