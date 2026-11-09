# VISHWAS AITHAL / PRODUCT LAB 01

Six original, local-first browser experiments, designed as working software rather than static portfolio mockups.

| App | What works | Important limit |
| :-- | :-- | :-- |
| ServiceDesk.exe | Create support tickets, triage statuses, search, filter, metrics, export and reset | No backend, SLA clock, shared queue or real customers |
| LinkVault.exe | Save valid HTTP links, tag, search, favorite, remove and export | No hosted redirect or shared link service |
| QuoteAtlas.exe | Original sample lines, custom notes, favorites, copy and export | Not a licensed quotations database |
| FlowFeed.exe | Filter and progressively display 96 demo cards through IntersectionObserver | Synthetic data, no remote feed or infinite network requests |
| [ImpactHub](impact/) | Fictional volunteer-hour planning with campaign/skill filters, local pledges and export | No real NGO, registration, donation or partner integration |
| [Commerce Sandbox](commerce/) | Sample inventory, bounded cart, simulated stock deduction, demo receipts and export | No payments, checkout backend or real merchandise |

The workbench is hosted as static source under \`labs/\`. Run locally with a static HTTP server, such as \`python -m http.server 8000\`, then open \`http://localhost:8000/labs/\`. Direct \`file://\` use may block JavaScript modules.

## Safety and privacy

* No authentication, analytics, external scripts, build framework or CDN assets.
* Data is saved in browser localStorage where permitted.
* External bookmarks are validated as HTTP or HTTPS and opened with \`noopener noreferrer\`.
* Dynamic user-provided text uses DOM \`textContent\`, not HTML injection.
* Sensitive data, passwords and customer tickets should not be placed into a public browser prototype.
* The interface includes keyboard-operable tab navigation and reduced-motion support.
* Source code was written for this project. Earlier public GitHub repositories were used as general feature references, not copied into this application.

## Run tests

\`\`\`sh
node --test labs/test/*.test.mjs
\`\`\`

© Vishwas Aithal. See root MIT license.
