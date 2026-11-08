# After Hours / Vishwas Aithal

The public GitHub identity is **Vishwas Aithal**. The visual system is a personal computing archive with a quiet editorial character, not a simulated command center.

This document governs the profile README, all eight public project READMEs and the linked interactive Pages collection.

## Art direction

Think of a well-kept computer desk after closing time: brushed charcoal, warm monitor light, straightforward typography, a few precise line drawings and enough empty space for the interesting things to matter.

- **One idea per screen.** Show the person and actual work before a list of interactive extras.
- **Typography first.** Use regular system sans-serif for reading; reserve monospace for file paths, labels and computing references.
- **Fewer colors.** Charcoal, off-white, weathered sage and one muted brass accent.
- **Original drawings.** Each repository has a different subject-specific line illustration. Avoid simulated traffic, ungrounded scores, fake status indicators and generic network graphics.
- **Understated motion.** No perpetual animation on README banners. Game animation remains where it has a purpose. Respect reduced-motion preferences.
- **Useful interactions.** Never hide actual setup, testing, source, demo links or security boundaries behind visual effects.
- **Readable GitHub rendering.** The README is Markdown and supported HTML. Interactive applications run on separate GitHub Pages, not inside the README.

## Palette

| Token | Hex | Purpose |
| :-- | :-- | :-- |
| Charcoal | `#151b1c` | Base background |
| Stone | `#202829` | Panels |
| Rule | `#394541` | Thin separators |
| Paper | `#e9e9df` | Primary type |
| Sage | `#a6b7a9` | Secondary emphasis |
| Brass | `#c4ad89` | Small accents |
| Muted text | `#a2aca5` | Descriptions |

No decorative gradients or fake monitoring telemetry on the top-level surfaces. Optional alternate themes inside specific interactive experiences may differ but must remain readable.

## Source of truth

- `assets/brand/vishwas-exe-main.svg`: main editorial header.
- `assets/brand/vishwas-exe-*.svg`: project-specific headers, one line motif per repository.
- `assets/brand/retro-shell.css`: shared navigation, spacing and window styles.
- `assets/brand/favicon.svg`: simple site icon.
- `index.html`: concise personal home and project index.
- `README.md`: short GitHub profile.
- `README-archive-2026-11-09.md`: complete preserved previous profile.
- `memory/`, `museum/`, `arcade/`, `overload/`: interactive collections.
- `overload/qa.mjs`: nine-page structural quality check.
- `tools/check_unified_public_theme.mjs`: read-only audit of all eight public repository headers.
- `.github/workflows/overload-smoke.yml` and `.github/workflows/public-quality-audit.yml`: existing automated verification.

## All public repositories

| Repository | Illustration |
| :-- | :-- |
| `vishwasaithalz` | An old personal computer |
| `YYYH` | Open notebook |
| `flagship-api` | API request window |
| `recon-lite` | HTTP response headers |
| `nextjs-boilerplate` | Layout grid |
| `LogSentry` | Event records |
| `CyberPlayground` | Learning maze |
| `AI-Automation-Lab` | Automation flow |
| `KARMA-Ops-Monitor` | Simple trend line |

Functional repository names and internal identifiers are not rebranded.

## Quality checklist

1. Open the README at GitHub default desktop width and on a narrow viewport. The first screen should show what the project is and how to find its source.
2. Make typography readable without custom web fonts.
3. Check keyboard focus, contrast, responsiveness and reduced-motion settings.
4. Keep visual source files static and small. Do not add third-party image hosts or JS packages solely for decoration.
5. Retain technical run, test and safety sections on project READMEs.
6. Verify all relative asset links and script syntax with `node overload/qa.mjs`.
7. Confirm GitHub Actions status before reporting successful CI or Pages deployment.
8. Keep private names, secrets and unverified metrics out of public content.

The goal is not to look maximally complex. It is to be unmistakably personal and easy to use.
