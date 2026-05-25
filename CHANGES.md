# Webority Government — Changes Log

> **Latest revision** &mdash; homepage redesigned to match the "Main Frame" mockup (split hero, image right, green trust-badge pills). Navy gov-topbar removed; Hindi toggle moved into the main nav. New `credentials.html` page added. See "Homepage redesign (Main Frame mockup)" section below for details.

This is the standalone Webority Government site at `C:\Users\WB0233-SURESH-RAWAT\webority-government\`.
It is **not** a filtered copy of the main `www.webority.com` mirror — it is the lightweight, hand-built site for the Indian public sector. The main-firm mirror is untouched.

---

## Homepage redesign (Main Frame mockup)

Implemented from the PDF mockup you supplied.

### What changed
- **Hero**: replaced the original centered text-only hero with a two-column layout &mdash; copy on the left, hero image on the right. New italic-serif `<h1>`: *"Trusted Technology Partner for India's Public Sector"*. Single CTA: *"Request a Consultation &rarr;"*
- **Trust badges**: 5 green check-marked pills below the CTA (Startup India &middot; DPIIT / CMMI Level 5 / ISO Certified / GIGW Compliant / GeM Registered). Uses CSS-only scalloped green seal &mdash; no images
- **Brand wordmark**: changed from `Webority / Government` to `Webority / Technologies`, matching the mockup. The new `.brand--mockup` modifier hides the "W" tile and styles "WEBORITY" as the purple wordmark with "TECHNOLOGIES" beneath
- **Main nav**: now `Services / Case Studies / Sectors / Credentials / About Us` + a pill `Contact Us &rarr;` CTA &mdash; per the mockup
- **New page**: `credentials.html` so the new nav link resolves. Lists CMMI L5, ISO 9001/27001, Startup India, GeM, GIGW &mdash; with `TODO-WG` markers next to the GeM seller-ID and GIGW certificate (placeholders pending sign-off)
- **Navy gov-topbar removed**: the topbar I added in the previous iteration is gone &mdash; it didn't fit the mockup. The Hindi/EN toggle moved into the main nav (pill-style segmented control next to Contact Us). The grievance link is reachable from the footer ("Get in touch" column)
- **Skip-nav link** still present, still invisible until focused

### Hero image &mdash; legal note

The mockup shows the Lion Capital of Ashoka. **This is the State Emblem of India.** Its commercial use is regulated under the State Emblem of India (Prohibition of Improper Use) Act, 2005.

In code:
- The `<img src>` points at `images/hero-public-sector.webp` &mdash; a file you supply
- If the file is missing, an `onerror` handler hides the `<img>` and shows a dashed placeholder so the layout doesn't break
- An inline `TODO-WG (LEGAL REVIEW REQUIRED)` comment sits directly above the `<img>` tag &mdash; grep `TODO-WG` to find it
- `images/README.md` repeats the legal note for whoever drops the asset in

### CSS additions
All new rules were **appended** to `css/style.css` &mdash; no original rule was modified. New class names: `.hero-v2`, `.hero-v2-grid`, `.hero-v2-heading`, `.hero-v2-lead`, `.hero-v2-actions`, `.hero-v2-image-wrap`, `.hero-v2-image`, `.hero-v2-image-placeholder`, `.trust-badges`, `.trust-badge`, `.trust-badge-mark`, `.nav-lang`, `.nav-cta-group`, `.brand--mockup`.

The original `.hero` rules remain in place but are no longer referenced by `index.html`.

### Files touched this revision
- `index.html` &mdash; hero replaced, brand + nav updated, gov-topbar removed
- `about.html`, `services.html`, `sectors.html`, `case-studies.html`, `contact.html` &mdash; brand + nav updated, gov-topbar removed
- `credentials.html` &mdash; **new**
- `css/style.css` &mdash; ~150 new lines appended
- `images/README.md` &mdash; **new**

---

## Folder layout

| Folder | Purpose |
|---|---|
| `C:\Users\WB0233-SURESH-RAWAT\webority-government\` | **The active site** (6 hand-built pages) |
| `C:\Users\WB0233-SURESH-RAWAT\www.webority.com\` | The original Webority Technologies mirror (untouched) |
| `C:\Users\WB0233-SURESH-RAWAT\webority-government_mirror-clone\` | An earlier mirror-clone-and-filter attempt (kept for reference only — see end of this file) |

---

## Active site contents

```
webority-government/
├── index.html
├── about.html
├── services.html
├── sectors.html
├── case-studies.html
├── contact.html
├── css/
│   ├── style.css                    (hand-built — UNTOUCHED)
│   └── gov-identity.css             (NEW — topbar + skip-nav + focus styles)
├── js/
│   ├── main.js                      (hand-built — UNTOUCHED)
│   └── lang-toggle.js               (NEW — EN/Hindi toggle placeholder)
├── CHANGES.md                       (this file)
└── REVIEW_NEEDED.md
```

---

## What was already in the scaffold (before this session)

The 6 hand-built pages already had B2G copy written for the public sector. No bulk find-replace was needed. Highlights:
- Hero positioning: *"Building Digital Trust for Indian Government"*
- Tone: formal, institutional, factual
- Already mentions: **India Stack** (Aadhaar, DigiLocker, UMANG), **CMMI Level 5**, **ISO 27001:2022**, **ISO 9001:2015**, **MSME Registered**, **GeM-ready Vendor**
- Already references: Ministries, Departments, PSUs, Smart Cities
- Contact page already has proper `<label for="…">` form labels
- Single `<h1>` per page (clean heading hierarchy)
- No `<img>` tags anywhere — the scaffold is CSS-glyph and text only, which avoids the alt-text problem entirely
- Primary color `#6200ee` already set as a CSS variable copied verbatim from the parent firm's design system

---

## What was added this session

### 1. New global assets (TASK 3 — Design differentiation)

| File | Purpose |
|---|---|
| `css/gov-identity.css` | Government identity top-bar, "Webority Government" saffron badge, EN/`हिंदी` toggle, skip-nav-link style, `:focus-visible` outlines |
| `js/lang-toggle.js` | EN/Hindi toggle placeholder. Flips `aria-pressed`, updates `<html lang>`, persists to `localStorage`. **Does NOT translate copy** — TODO: wire up Bhashini or a content bundle |

### 2. Injected into every page (TASK 3 + TASK 4)

Every one of the 6 HTML pages now contains, guarded by the marker `WG_GOV_BAR_MARK`:

1. **`<link rel="stylesheet" href="css/gov-identity.css" />`** before `</head>`
2. **`<a class="skip-nav-link" href="#main-content">Skip to main content</a>`** as the first child of `<body>` — WCAG 2.4.1
3. **Government identity top-bar** above the existing `.site-header`:
   - "Webority Government" badge with a decorative CSS chakra-style mark (NOT the national emblem)
   - Tagline: *"Public Sector IT · Built for Bharat"*
   - Quick-links: Grievance / Contact
   - EN / `हिंदी` language toggle buttons
4. **`<a id="main-content" tabindex="-1"></a>`** immediately after `</header>` — the skip-nav target
5. **`<script src="js/lang-toggle.js" defer></script>`** before `</body>`

### 3. New grievance redressal section (TASK 4 — GIGW compliance)

Added to `contact.html` at `#grievance`, with a three-level escalation matrix:

| Level | Role | Status |
|---|---|---|
| L1 | Engagement lead | Live (`contact@webority.com`, 1-business-day SLA) |
| L2 | Public-sector practice head | **TODO-WG**: placeholder email `grievance@webority.com` — confirm or replace |
| L3 | Designated Grievance Officer (IT Act / DPDP Act) | **TODO-WG**: officer not yet designated; section says so explicitly |

The TODO markers are inline comments inside the HTML so they can be greped (`grep -r "TODO-WG" .`).

### 4. Accessibility posture (TASK 4 — compliance summary)

| GIGW / WCAG check | Result |
|---|---|
| Skip-nav link | ✅ added on every page |
| Skip-nav target | ✅ `<a id="main-content">` after every `</header>` |
| `<html lang="en">` | ✅ already present on every page |
| `<title>` | ✅ already present on every page |
| `<img>` missing alt | ✅ N/A — scaffold uses 0 images |
| Single `<h1>` per page | ✅ verified |
| Form labels (`<label for>`) | ✅ already correctly wired on `contact.html` |
| Focus-visible outline | ✅ added by `gov-identity.css` (3px `#FFD600` gold outline) |
| Grievance / escalation page | ✅ added to `contact.html#grievance` (with 2 placeholder rows clearly marked TODO-WG) |

---

## What was **not** changed

- `css/style.css` — your hand-built stylesheet was not modified. The gov topbar lives in a separate `gov-identity.css` so you can review or remove it cleanly
- `js/main.js` — untouched
- Page copy — already gov-focused; no rewriting was done
- The parent firm's mirror at `www.webority.com\` — completely untouched
- The previous mirror-clone-and-filter attempt at `webority-government_mirror-clone\` — kept on disk in case you want to scavenge phrases from it, but it is **not** the active site and is **not** being served

---

## Primary color

`#6200ee` (the parent firm's primary) was kept as the body/CTA primary — you confirmed this earlier when selecting `#6200EE` in the palette question. The new top-bar uses navy (`#0B2545`) and saffron (`#FF9933`) **only** in the slim identity strip above the existing header; the main-page UI is unchanged.

---

## Helper / reference

To find every spot the automation flagged for human review:
```powershell
Select-String -Path . -Pattern "TODO-WG" -Recurse
```

---

## About the `webority-government_mirror-clone\` folder

In an earlier turn of this conversation I cloned the full `www.webority.com\` mirror, filtered out private-sector pages, applied bulk B2G phrase replacements, and injected the same gov topbar across all 302 pages. That work is **archived** at `C:\Users\WB0233-SURESH-RAWAT\webority-government_mirror-clone\` along with its own `CHANGES.md` and `REVIEW_NEEDED.md`. The user redirected to keep the gov site as a focused standalone, so that clone is not active. Delete the folder when you no longer need it for reference.
