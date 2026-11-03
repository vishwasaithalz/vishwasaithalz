# KARMA Operations Runbook
Updated 2026-11-03. Scope: five selected GitHub-linked Vercel websites only. Facebook excluded.

## Verification gates
1. GitHub Actions `.github/workflows/karma-health.yml` writes `portfolio-control-center/health.json` after an actual run. Inspect timestamp, each HTTP response, and `contentVerified`. A response of 200 without expected page text is an alert.
2. A `protected` 401/403 response is not proof of downtime. Check Vercel Authentication before attempting fixes.
3. For `attention`, compare the last known working deployment and Vercel build logs, then reproduce the failure. Check important navigation and at least one core interaction manually or with an authorized browser test.
4. Never automatically redeploy arbitrary commits, delete projects, modify production DNS, or expose API tokens in client code.
5. Before a repair: create a source checkpoint; test the proposed change; deploy to preview; verify routes and functional smoke tests; promote only when validated. If it fails, restore the known-good deployment. Record exact IDs, error and resolution in Build Journal.

## Source of truth
- Private dashboard: https://portfolio-control-center-yyyh1.vercel.app/
- Health workflow: https://github.com/vishwasaithalz/vishwasaithalz/actions/workflows/karma-health.yml
- Public JSON snapshot: https://raw.githubusercontent.com/vishwasaithalz/vishwasaithalz/main/portfolio-control-center/health.json
- Instagram editorial: `portfolio-control-center/INSTAGRAM_WEEK_01.md`
- Quora editorial: `portfolio-control-center/QUORA_DRAFT_QUEUE.md`
- Build Journal: https://build-journal-yyyh1.vercel.app/

## Publishing boundaries
- Instagram: Metricool brand 7826143; original assets, rights and captions must be reviewed. No publication or scheduling before explicit final media approval. Do not pretend prototype reels are finished.
- Quora: match actual current questions, edit substantive answers, use only a verified supported authorized publishing path; otherwise manual posting. Never automate fake comments, votes or engagement.
- No Facebook operations.

## Remaining integration architecture
Real in-dashboard publishing requires authenticated server-side API routes, protected secrets, provider authorization, user-level approval logging, request validation, and an audit trail. The existing static dashboard does not currently provide those backend capabilities. Do not claim that UI links or status JSON constitute a live publishing API.
