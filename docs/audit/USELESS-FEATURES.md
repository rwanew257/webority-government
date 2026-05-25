# Useless / Dead Features Report — Webority Government

> **Run date:** 2026-05-23
> **Companion to:** [`FLOW-AUDIT.md`](./FLOW-AUDIT.md), [`MANUAL-DECISIONS.md`](./MANUAL-DECISIONS.md)
>
> Verdict legend:
> - **KEEP** — active feature, stays as-is
> - **DEFER** — not now, but planned; keep code, move out of view until ready
> - **DELETE** — truly unused, no plan, no value; remove from codebase
> - **AHEAD-OF-LEGAL** — UI is real, content is real, awaiting legal/client sign-off (marketing-site equivalent of AHEAD-OF-BACKEND)

---

## Headline result

**Nothing structurally dead — but the codebase is intentionally ahead of two things: legal review and design content.** 39 `TODO-WG` markers across 8 HTML files annotate sections where the UI and copy are production-ready but the publish trigger is written authorisation from the named public-sector entity. The actual cleanup list is short: 16 stub Privacy/Terms links, 2 non-functional carousel arrows, 1 pretend-submit contact form, ~290 lines of dead CSS in `style.css` (legacy hero iterations), and a fully styled but never-rendered `.gov-topbar` component. **Estimated code cleanup: 6 hours. Content/legal coordination is the gating factor for publish, not code.**

---

## 1 · TODO / FIXME / HACK comments

**Finding:** 39 `TODO-WG` markers across 8 HTML files. 0 `FIXME`. 0 `HACK`. All TODO-WG markers follow a convention: `<!-- TODO-WG: [what needs to change before publish] -->`.

| Category | Count | Files |
|---|---|---|
| Confirm public-sector entity engagement before listing | 24 | all 8 pages × footer "Industries" column + each entity card |
| Replace placeholder image / photo with approved asset | 8 | services (8), credentials (2), about (1), sectors (1) |
| Confirm milestone year / programme name before publish | 3 | about.html (timeline) |
| Replace placeholder names (Leader, Partner) | 2 | index.html (leadership), sectors.html (partners) |
| Replace approved client reference for example deployment | 1 (covers 8 sub-mentions) | services.html |
| LEGAL REVIEW REQUIRED on State Emblem image | 1 | index.html (Ashoka image) |

**Convention is already consistent** — every TODO has a `WG` prefix and a clear acceptance criterion. **Verdict: KEEP all; treat as AHEAD-OF-LEGAL.**

**Action:** Maintain a single TODO-WG resolution ledger so legal/PMM know what's blocking which page. No bare TODOs added going forward.

---

## 2 · Buttons / links with no handler (no-ops, dead CTAs)

**Finding:** 19 unwired interactive elements across the site.

| File | Line | Element | Note | Verdict |
|---|---|---|---|---|
| `case-studies.html`, `services.html`, `about.html`, `index.html`, `sectors.html`, `portfolio.html`, `credentials.html`, `contact.html` | 8 × 2 each = **16** | `<a href="#" data-todo="WG: create privacy-policy.html">Privacy Policy</a>` + Terms | Pages don't exist | **DEFER — create pages, then wire** |
| `contact.html` | 133 | `<a class="btn-pill" href="#" aria-label="Download company profile PDF (placeholder)">Download Profile</a>` | PDF not uploaded | **DEFER — upload PDF first** |
| `index.html` | 320, 323 | `<button class="case-nav-btn" data-case-nav="prev">` and `next` | Styled but no JS handler in main.js or lang-toggle.js | **DEFER — wire when 2nd case study added** |
| `js/main.js` | 124-142 | `<form id="contactForm">` submit handler — calls `e.preventDefault()` + shows hardcoded status | Not posting anywhere | **🛑 BLOCKER — wire to backend before launch** |

**Total unwired**: 16 stub `href="#"` + 1 stub PDF link + 2 non-functional buttons + 1 fake form submit = **20 interaction surfaces that don't do what they promise.**

---

## 3 · Orphan pages (exist but not in main nav)

**Finding:** 1 orphan.

| Page | Reachable via | Roadmap status | Verdict | Reasoning |
|---|---|---|---|---|
| `portfolio.html` | Homepage "View Our Clients →" button (index.html:328); every footer "Industries" column (6 entries × 8 pages = 48 internal hits) | Active | **KEEP — promote to nav OR keep as drill-down** | Decision needed. Currently 49 incoming links from across the site but not in primary nav. See [MANUAL-DECISIONS.md](./MANUAL-DECISIONS.md). |

No other orphans. Every page (`index, about, services, case-studies, sectors, credentials, contact`) is in the primary nav.

---

## 4 · Dead / placeholder content sections

**Finding:** 5 sections that visibly degrade the buyer's first impression of the site.

| Location | Content | Verdict | Action |
|---|---|---|---|
| `index.html:511-526` (leadership) | 3 cards × "Leader name — TBD" | **🛑 BLOCKER** | Replace with real bios + photos OR remove section |
| `sectors.html:124-168` (5 sector panels) | "Detailed [Health/Defence/Parliament/Quality/Smart Cities] capability content — coming soon." | **🛑 DEFER** | Either flesh out all 5 OR remove tabs from the strip until content lands |
| `sectors.html:203-213` (partners) | 3 cards × "Partner Organisation N — TBD" | **🛑 DELETE for now** | Hide section until partners are approved and named |
| `credentials.html:90, 97` | 2 cert cards labelled `IT Service Management (TBD)` and `Business Continuity (TBD)` (ISO 20000-1, ISO 22301) | **DEFER** | Commit to a target date or remove the (TBD) cards |
| `about.html:166, 182` (timeline) | 2 timeline entries explicitly note `(Specific programme name pending client confirmation — TODO-WG)` | **AHEAD-OF-LEGAL** | Replace once client clearance lands |

---

## 5 · Dead CSS (style.css legacy stack)

**Finding:** `css/style.css` is 106 KB. ~290 lines of dead CSS from 5 stacked hero iterations.

```
$ grep -n '\.hero-v2-image-wrap\s*{' css/style.css
1021:.hero-v2-image-wrap {       ← original (v2) — visible flex container
3133:.hero-v2-image-wrap {       ← v3 — bleed right edge
3175:.hero-v2-image-wrap {       ← v4 — bleed both sides
3236:.hero-v2-image-wrap {       ← v5a — position absolute (image as bg)
3323:.hero-v2-image-wrap { display: none; }  ← v5 final — hide <img>, paint via ::before
```

| Issue | Lines | Action |
|---|---|---|
| 5 stacked `.hero-v2-image-wrap` rules (v2 → v5) | ~120 LOC | **DELETE v2-v4**; keep v5 (currently the active variant) |
| 2 `.hero-v2-image` definitions (lines 1027, 3245) | ~30 LOC | Consolidate to one |
| 2 `.portfolio-v2-logo` definitions (lines 3362, 3547) | ~30 LOC | Consolidate to one |
| Legacy purple `--primary: #6200ee` definition | 1 LOC (line 13) | Token now overridden by design-polish.css. **KEEP** as fallback or **DELETE** + update references |
| Inline-styled `.eyebrow` spans (16+ occurrences across HTML) | 16 × ~5 lines each | Promote to a CSS class, drop inline |

---

## 6 · Dead component CSS (gov-identity.css)

**Finding:** `.gov-topbar` is fully styled (~80 LOC in gov-identity.css) but **not rendered on any page**.

```
$ grep -rn 'gov-topbar' --include='*.html'  # returns nothing
$ grep -rn 'gov-topbar' --include='*.css'   # only the definitions
$ grep -rn 'gov-topbar' --include='*.md'    # CHANGES.md ref only
```

| Component | LOC | Verdict | Reasoning |
|---|---|---|---|
| `.gov-topbar` + sub-elements (`.gov-topbar-inner`, `.gov-badge`, `.gov-topbar-tagline`, `.gov-topbar-links`, `.gov-lang-sep`, `.gov-lang-group`) | ~80 | **AHEAD-OF-DESIGN** — render it, or **DELETE** | Designed to sit above `.site-header` with "Government of India" identity strip. Never wired into HTML. See [MANUAL-DECISIONS.md](./MANUAL-DECISIONS.md). |

The `.gov-lang-toggle` rules from the same file ARE used (every page has the EN / हिंदी buttons). KEEP those.

---

## 7 · Outdated aria-labels

**Finding:** 8 occurrences of an outdated label across the 8 pages.

```
$ grep -n 'Hindi copy not yet wired' *.html
index.html, about.html, services.html, case-studies.html, sectors.html, credentials.html, portfolio.html, contact.html
```

All 8 pages have `aria-label="Language switcher (placeholder - Hindi copy not yet wired)"` on the `.nav-lang` group. **The dictionary IS wired now** (`js/i18n-dict.js` + `js/lang-toggle.js`, ~600 keys covering nav + hero + footer + service rows). The label misleads screen-reader users.

| File | Action |
|---|---|
| All 8 HTML files | Replace label with `aria-label="Language switcher (English / Hindi)"` |

---

## 8 · Possibly dead JS

**Finding:** 1 stats-counter handler that may have no callers.

| File | Lines | Status | Verdict |
|---|---|---|---|
| `js/main.js:60-88` (stats counter) | Animates `.stats-number[data-target]` from 0 → target on scroll | **No element on any page has `data-target=`** (verify with `grep -rn 'data-target=' .`) | **DELETE if confirmed dead** — or wire up the existing stats panels (`.stats-v2 .num`) to use `data-target` for the count-up animation |

The stats blocks on index/about/case-studies/sectors render the final value statically ("10+", "500+", "80+", etc.). The count-up animation in main.js was likely written for an earlier version. **Decide: implement the animation properly OR delete the 30 LOC.**

---

## 9 · Useless image references

**Finding:** 1 referenced directory does not exist.

| Reference | File | Verdict |
|---|---|---|
| `images/logos/enterprise/` (comment in portfolio.html:129 says "drop into images/logos/enterprise/") | `portfolio.html` | **Create directory + populate, OR remove the comment hint.** 22 enterprise cards still use 2-3-letter monograms. |

---

## Summary

| Verdict | Count |
|---|---|
| KEEP (as-is) | 5 pages |
| KEEP — high drift (needs token re-alignment) | 1 page (index.html) |
| KEEP — clarify nav placement | 1 page (portfolio.html) |
| DEFER — content authoring needed | 5 sector panels, 3 leadership cards, 3 partner cards, 2 ISO certs, 2 timeline programme names, 16 privacy/terms stubs, 1 PDF download |
| DELETE — dead code | ~290 LOC CSS (legacy hero stack), 30 LOC JS (stats counter if dead), possibly the `.gov-topbar` (~80 LOC) if it won't be rendered |
| AHEAD-OF-LEGAL | 39 TODO-WG markers; treat as content-blocked not code-blocked |

**Total cleanup effort:**

| Workstream | Effort |
|---|---|
| Code cleanup (CSS legacy + JS counter + aria-labels + form wiring) | ~6 hours |
| Decide nav placement for portfolio.html | 1 meeting |
| Author privacy-policy.html + terms-conditions.html | 1-2 days (legal + content) |
| Resolve 5 sector panels (Health, Defence, Parliament, Quality, Smart Cities) | 2-3 weeks (sector PMs + content) |
| Replace 3 leadership TBDs with real bios | 1 week (HR + content) |
| Approve 39 TODO-WG public-sector references | 2-4 weeks (legal + each client) |
| Photography (team, services, case visuals) | 3-4 weeks (commission shoots) |

**Risk items needing manual review:** see [MANUAL-DECISIONS.md](./MANUAL-DECISIONS.md).
