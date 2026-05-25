# Flow Audit — Webority Government

> **Run date:** 2026-05-23
> **Auditor:** Claude (platform-design-engine · Phase 5)
> **Companion docs:** [`USELESS-FEATURES.md`](./USELESS-FEATURES.md), [`MANUAL-DECISIONS.md`](./MANUAL-DECISIONS.md)
> **Scope:** 8 static HTML pages + shared CSS / JS / i18n bundles.

## Headline result

**Nothing in this codebase is structurally dead — but ~40% of the visible surface is awaiting legal sign-off before publish.** Every page renders, every nav link resolves, and every section was built to a real spec. The dominant pattern is **AHEAD-OF-LEGAL-REVIEW**: 39 `TODO-WG` markers across 8 files flag content that is real but pending written authorisation from the named public-sector entity (ministries, PSUs, programmes). Below that, there are 16 unwired footer links (Privacy / Terms — pages don't exist yet), 1 unwired CTA (Download Profile PDF on contact.html), 2 non-functional carousel arrows (homepage case-card, awaiting second case study), 1 outdated aria-label across 8 pages (Hindi toggle now wired but label still says "not wired"), and ~290 lines of dead CSS (5 obsolete `.hero-v2` iterations in `style.css`, a fully-styled `.gov-topbar` that's rendered nowhere). **Estimated cleanup before redesign work: 6 hours of code + 2-3 weeks of content/legal coordination.**

---

## Method

1. Enumerated every HTML page in repo root: `index, about, services, case-studies, sectors, credentials, portfolio, contact`.
2. Cross-referenced against `<ul class="nav-menu">` entries on each page (all 8 have identical nav markup).
3. For each flow, traced: entry point → action → success state → external link / form / placeholder.
4. Verdict per flow: **KEEP** / **DEFER** / **DELETE** / **AHEAD-OF-LEGAL** (the marketing-site equivalent of AHEAD-OF-BACKEND).
5. Searched for `href="#"`, `data-todo=`, no-op handlers, TODO markers, placeholder text, dead CSS rules.

---

## Per-page audit

### Page: `index.html` (homepage)

- **In nav:** ✅ (logo + brand mark)
- **Sections (top → bottom):** hero · public-sector portfolio (9 ministry cards) · stats panel · AI-powered solutions split · technology services grid (6 cards) · case showcase ("Our Work") · sectors grid (6 cards) · solutions grid (6 cards) · credentials row (5 seals) · leadership team (3 cards) · why-Webority trust list (5 items) · FAQ accordion (5 items) · contact CTA · footer
- **Verdict:** **KEEP — high drift**
- **Drift items:**
  - Hero swapped to full-bleed Ashoka background — overrides ~9 spec rules (intentional per user pref, doc in DESIGN-SYSTEM.md §12)
  - Case-card uses italic Georgia serif title — diverges from §7.4 sect-head spec
  - Leadership: 3 × "Leader name — TBD" cards. **Blocks publish.**
  - Saffron eyebrow color overridden via inline style on every section (16 inline-styled `.eyebrow` spans). Design-system §3.1 says eyebrow color comes from `--saffron-600`.
  - Case-card "prev/next" arrows have no JS handler — see USELESS-FEATURES §3.

### Page: `about.html`

- **In nav:** ✅
- **Sections:** svc-hero ("A Decade Delivering for India's Public Sector") · story-split + stats · how-we-work process grid (8 cards) · key milestones timeline (6 rows: 2016 → 2025) · footer
- **Verdict:** **KEEP**
- **Notes:**
  - Story image is a gradient placeholder (`<span>Team photography placeholder</span>`). **Blocks visual quality — needs approved team photo.**
  - 2 timeline entries explicitly say `*(Specific programme name pending client confirmation — TODO-WG)*` (2019 entry, 2021–24 entry).

### Page: `services.html`

- **In nav:** ✅
- **Sections:** svc-hero · 8 `.svc-row-section` blocks (`#egov, #ai, #security, #mobile, #modernization, #consulting, #cloud, #staffing`) · FAQ · footer
- **In-page anchors:** All 8 service IDs exist and resolve. ✅
- **Verdict:** **KEEP**
- **Notes:**
  - 9 phone/screenshot placeholder spans (`<span class="placeholder-note">…placeholder</span>`). All 8 service rows have a placeholder visual.
  - 8 TODO-WG markers — every service row's "Example deployment" needs an approved client reference before going public.

### Page: `case-studies.html`

- **In nav:** ✅
- **Sections:** svc-hero · stats · 4 case cards (BEE Star Label, Parliamentary Cafeteria, Defence PSU, NBT Publishing) · FAQ · footer
- **Verdict:** **KEEP**
- **Notes:**
  - All 4 case cards labelled `(Illustrative; subject to client confirmation.)` — content is illustrative until cleared.
  - 4 × `<span class="case-card-placeholder">phone-mockup placeholder</span>` — all 4 cards need real screenshots.

### Page: `sectors.html`

- **In nav:** ✅
- **Sections:** svc-hero · stats · 6 sector tabs with detail panels · partners block · footer
- **Verdict:** **DEFER 5 of 6 sector panels**
- **Detail:**
  - **Energy & Environment** — fully fleshed (6 capability cards + reference project). **KEEP.**
  - **Health & Welfare** — `Detailed Health & Welfare capability content — coming soon.` **DEFER.**
  - **Defence & Security** — same placeholder. **DEFER.**
  - **Parliament & Legislative** — same placeholder. **DEFER.**
  - **Quality & Standards** — same placeholder. **DEFER.**
  - **Smart Cities & Urban** — same placeholder. **DEFER.**
- **Notes:**
  - Either flesh out the 5 missing sectors OR remove their tabs from the tab strip until content lands. Current state shows 6 tabs but 5 are stubs — bad first impression for a buyer who clicks Defence and gets "coming soon".
  - 3 × `Partner Organisation [1-3] — TBD` placeholder cards. **DELETE the partner section until partners are approved**, or hide via `display:none` with a TODO.

### Page: `credentials.html`

- **In nav:** ✅
- **Sections:** svc-hero · formal certifications row (5 cards) · government registrations (GeM, CPPP, MSME, DPIIT) · standards we work to (6 cards) · security practices · CTA · footer
- **Verdict:** **KEEP**
- **Notes:**
  - 2 certifications labelled `IT Service Management (TBD)` and `Business Continuity (TBD)` — ISO 20000-1 and ISO 22301. **Either drop the (TBD) cards or commit to a date.**
  - 2 photography placeholders ("Approval workflow", "Cybersecurity ops") — gradient blocks.

### Page: `portfolio.html`

- **In nav:** ❌ orphan from main nav. Reachable via:
  - Homepage "View Our Clients →" button
  - Every footer "Industries" column (6 entries × 8 pages = 48 internal links)
- **Sections:** svc-hero · government & public-sector grid (9 entities) · enterprise & MNC grid (~22 entities) · CTA · footer
- **Verdict:** **KEEP — promote to nav OR keep as drill-down**
- **Decision needed:** see MANUAL-DECISIONS.md. Currently treated as drill-down only.
- **Notes:**
  - References a non-existent path: `images/logos/enterprise/` (comment line 129). 22 enterprise logos are still 2-3-letter text monograms. Public-sector grid now uses real logos (post-recent-upload).

### Page: `contact.html`

- **In nav:** ✅ (as CTA pill)
- **Sections:** svc-hero · direct-contact panel (email/phone/office/hours) · enquiry form · trust strip · footer
- **Verdict:** **KEEP — form is pretend-submit**
- **Notes:**
  - Submit button calls `e.preventDefault()` and shows a frontend success message. **Form is not wired to any backend.** See USELESS-FEATURES §2.
  - "Download Profile" link is `href="#"` with `aria-label="Download company profile PDF (placeholder)"`. No PDF exists. **Either upload the PDF + wire, or hide the button until ready.**

---

## Coverage matrix

| Page | In nav | Sections all wired | Internal anchors resolve | External CTAs functional | Placeholders blocking publish | Verdict |
|---|---|---|---|---|---|---|
| `index.html` | ✅ | ✅ | ✅ | ⚠️ case-card prev/next no-op | ⚠️ 3 leader TBDs, gradient mockups | KEEP (drift) |
| `about.html` | ✅ | ✅ | ✅ | ✅ | ⚠️ team photo placeholder, 2 milestone TODOs | KEEP |
| `services.html` | ✅ | ✅ | ✅ all 8 anchors | ✅ | ⚠️ 9 example-deployment placeholders | KEEP |
| `case-studies.html` | ✅ | ✅ | ✅ | ✅ | ⚠️ 4 phone-mockup placeholders, "illustrative" notes | KEEP |
| `sectors.html` | ✅ | ⚠️ 5 of 6 stub | ✅ | ✅ | 🛑 5 sector panels are "coming soon" | **5 panels DEFER** |
| `credentials.html` | ✅ | ✅ | ✅ | ✅ | ⚠️ 2 TBD certs, 2 photo placeholders | KEEP |
| `portfolio.html` | ❌ drill-down | ✅ | ✅ | ✅ | ⚠️ 22 enterprise text monograms | KEEP / promote? |
| `contact.html` | ✅ | ✅ | ✅ | 🛑 form pretend-submits, Download Profile = `#` | ⚠️ form backend missing, PDF missing | KEEP (wire form) |

---

## Cross-cutting issues

### Loading / empty / error states

- **Contact form** ([js/main.js:124-142](js/main.js#L124-L142)) — frontend-only. `preventDefault()`, no actual POST. Status message is hardcoded. **Wire to a backend** (Formspree, Netlify Forms, or in-house endpoint) before launch. Verify CSRF / spam protection.
- **Reveal-on-scroll** — `.reveal` class wired in `main.js`, gated by `IntersectionObserver`. Falls back to immediate visibility if API missing. ✅
- **Stats counters** ([js/main.js:60-88](js/main.js#L60-L88)) — counts up `data-target` attribute. No element on any page uses `data-target` (verify with `grep -rn 'data-target=' .`). Counter code may be dead.

### Accessibility

- **Hindi toggle aria-label stale** — 8 pages have `aria-label="Language switcher (placeholder - Hindi copy not yet wired)"`. The dictionary IS wired now ([js/i18n-dict.js](js/i18n-dict.js)). Update label to `aria-label="Language switcher (English / Hindi)"`.
- **Skip-nav link** present on all 8 pages. ✅
- **Focus-visible outline** styled in `gov-identity.css`. ✅
- **Image alt text** — all real images (logos, hero, case visual) have alt or aria-hidden. ✅
- **Color contrast** — light saffron eyebrows (`--saffron-600 #C46D12`) on white pass AA. Navy headings on white pass AAA. ✅

### Navigation consistency

- All 8 pages share identical `<header class="site-header">` + footer markup (modulo small variations in footer Industries list).
- The "About Us" link has `class="active"` on about.html only. Other pages don't mark active. **Inconsistency — either drop the active marker entirely or apply it per-page.** Minor.

### Image assets

- `images/hero-public-sector.jpg` ✅ (540 KB, used in hero `::before` background)
- `images/case-apollo-medtech.png` ✅ (304 KB, used in homepage case-card)
- `images/logos/gov/` ✅ (9 logos uploaded, wired into homepage portfolio)
- `images/logos/enterprise/` 🛑 — referenced in `portfolio.html:129` comment, **directory does not exist on disk**. 22 enterprise entities still show text monograms.

---

## Recommendations (priority-ordered)

1. **🛑 [BLOCKER] Wire the contact form to a real backend.** Pretend-submit is fine for staging; not for launch.
2. **🛑 [BLOCKER] Create `privacy-policy.html` and `terms-conditions.html`** OR remove the 16 stub footer links. Currently every footer ships with 2 dead links.
3. **🛑 [BLOCKER] Resolve 5 stub sector panels on sectors.html.** Either flesh out or remove tabs. A buyer clicking Defence and seeing "coming soon" is a credibility hit.
4. **🛑 [BLOCKER] Replace 3 "Leader name — TBD" team cards on index.html** with real bios + photos OR remove the section until ready.
5. **⚠️ Update Hindi toggle aria-label** on all 8 pages — it's outdated and misleading for screen-reader users.
6. **⚠️ Decide portfolio.html nav placement.** Either add to main nav (between Sectors and Credentials feels natural) or remove the unused footer references.
7. **⚠️ Upload enterprise logos** to `images/logos/enterprise/` OR keep monogram tiles. Either way commit one decision.
8. **⚠️ Wire case-card prev/next arrows** OR remove them. Adding 1 more case study would make this real.
9. **🧹 Clean up `style.css`** — 5 stacked `.hero-v2` iterations (v2 → v3 → v5) layer on each other. ~290 lines of dead CSS. See USELESS-FEATURES §4.
10. **🧹 Move inline eyebrow styles to CSS class.** Every `<span class="eyebrow">` has identical inline style (16+ occurrences). Promote to `.eyebrow` rule, drop inline.

Each blocker / warning has an owner in [MANUAL-DECISIONS.md](./MANUAL-DECISIONS.md).
