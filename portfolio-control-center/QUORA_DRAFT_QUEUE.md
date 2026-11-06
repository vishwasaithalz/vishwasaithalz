# KARMA Quora Desk 2.0 · Editorial Operations

Profile target: https://www.quora.com/profile/Vishwasaithal  
Workspace: `quora-desk.html` (linked from the private Portfolio Control Center)  
Last updated: 2026-11-05  
Status: research and drafting only; no Quora publishing integration connected.

## Included workspace features

- Candidate pipeline with search, topic/status filters and priority sorting.
- Draft studio with editable answer, title, source URLs and fact-check notes.
- Duplicate warning when adding a normalized question title already in the queue.
- Seven-step human review gate: real question, fit, source support, duplicate review, truthfulness, platform rules and final review.
- Editorial approval state, separate from publication.
- Manual publication history field that requires an actual Quora answer URL after posting.
- Research source vault.
- Daily brief, CSV, Markdown and JSON backup exports; JSON import.
- Browser-local persistence. Drafts remain on the user's device unless exported.
- No Quora credentials, session cookies, tokens, browser automation, votes, comments or auto-posting.

## Seed candidates

These are proposed topic concepts, not verified Quora questions. They have no confirmed question URLs, dates, follower counts or inspected answer competition. Each must be matched to a real question before publication.

1. GitHub Actions workflow security  -  least privilege, untrusted contributions, secrets and third-party actions. Priority 9.0/10.
2. Authentication versus authorization in API security  -  server-side object-level access checks. Priority 8.7/10.
3. JavaScript async/await error handling  -  promise rejection versus HTTP error status. Priority 8.4/10.

## Editorial policy

- Answer the exact question, directly and with useful substance.
- Use primary documentation where possible; open every source and verify it supports the associated claim.
- Separate documented facts, illustrative examples, recommendations and unknowns.
- Do not invent credentials, professional experience, client work, experiments or personal results.
- Avoid spam, repetitive answers, engagement manipulation, excessive self-promotion and affiliate links.
- Never crawl Quora, bypass access controls, automate login or use unofficial write endpoints.
- No answer or comment is published from this workspace. Manual publication is outside the application.
- Record only publicly verifiable or user-provided engagement metrics.

## Data and privacy

The workspace stores queue data in browser localStorage. It does not sync between devices and can be lost if browser storage is cleared. Use the JSON export regularly. Do not store passwords, session tokens, API keys or sensitive personal data.

## Future integrations

A future sync service would require an authenticated backend, access controls, secure storage, validation, audit logging and an officially supported provider integration. Until an authorized Quora publishing integration exists, the approval gate is editorial only and publishing remains manual.
