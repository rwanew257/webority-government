# Manual Decisions — Webority Government

> **Run date:** 2026-05-23
> **Source audit:** [`FLOW-AUDIT.md`](./FLOW-AUDIT.md), [`USELESS-FEATURES.md`](./USELESS-FEATURES.md)
>
> Items below require a named human decision before code or content moves forward. Every row has an owner. **No design or dev work should proceed on a row until its owner has decided.**

## Decision register

| # | Page / Feature | Decision needed | Why manual | Owner | Status |
|---|---|---|---|---|---|
| D-001 | Hero image (Lion Capital of Ashoka, `images/hero-public-sector.jpg`) | Confirm legal authorisation to use the State Emblem of India publicly | Regulated by the State Emblem of India (Prohibition of Improper Use) Act, 2005 — written authorisation typically required | Legal counsel | **Pending** |
| D-002 | Privacy Policy + Terms & Conditions | Create both pages OR remove 16 stub footer links across 8 HTML files | Footer ships with `href="#"` placeholders on every page — buyer-unfriendly | Legal + content lead | **Pending** |
| D-003 | Contact form backend | Choose backend (Formspree / Netlify Forms / in-house endpoint / Bhashini gateway) and wire `js/main.js:124-142` | Form currently calls `e.preventDefault()` and fakes a success message. Risk: prospects assume their enquiry was submitted, never hear back | Tech lead | **Pending** |
| D-004 | `sectors.html` — 5 stub sector panels (Health & Welfare, Defence, Parliament, Quality, Smart Cities) | Either flesh out all 5 OR remove tabs from the strip until content lands | A buyer in Defence clicking the tab sees "coming soon" — credibility hit. Energy & Environment is the only fully built panel. | Sector PMs + content lead | **Pending** |
| D-005 | Leadership team on `index.html` | Replace 3 × "Leader name — TBD" with real bios + photos, OR remove the leadership section until ready | Hard placeholder content visible above-the-fold-equivalent on the homepage | HR + leadership | **Pending** |
| D-006 | Partner Organisations on `sectors.html` | Replace 3 × "Partner Organisation N — TBD" cards OR delete the section | Pure placeholder cards damaging the credibility signal of the sector page | Partnerships lead | **Pending** |
| D-007 | Credentials TBD certs (`ISO 20000-1`, `ISO 22301`) | Commit to a target certification date OR remove the (TBD) cards from credentials.html | Showing "(TBD)" next to a certification undermines the "documented proof" framing of the page | QA / compliance lead | **Pending** |
| D-008 | `portfolio.html` nav placement | Promote to main nav (e.g., between Sectors and Credentials) OR keep as drill-down only from homepage button + footer | Currently 49 internal links point to it but it's absent from primary nav — inconsistent IA | Marketing / design lead | **Pending** |
| D-009 | 39 TODO-WG public-sector entity confirmations | Per-entity written approval to list publicly | All ministry, PSU, programme names on portfolio.html / case-studies.html / footer / index.html portfolio cards / about.html timeline | Each engagement's named client liaison + legal | **Pending (rolling)** |
| D-010 | Approved photography (hero, team, services rows, case visuals, credentials) | Commission shoots OR commit to gradient/illustrated placeholders for v1 launch | Currently: 1 real hero image, 9 real ministry logos, 1 real BEE case visual. Everything else is gradient placeholder. | Creative director | **Pending** |
| D-011 | `gov-topbar` (in `gov-identity.css`, never rendered) | Render the Government identity strip above `.site-header` on every page, OR delete the ~80 LOC of orphan CSS | Component is designed and styled but no HTML emits it. Common Indian gov-portal convention (saffron-tricolor + "Government of India" + accessibility tools + language switcher) | Design lead | **Pending** |
| D-012 | Stats counter animation (`js/main.js:60-88`) | Wire `.stats-v2 .num` to use `data-target=` for count-up animation OR delete the ~30 LOC handler | Code exists for a feature no element invokes | Frontend lead | **Pending** |
| D-013 | Homepage case-card prev/next arrows | Wire to a second case-study slide (and a third, etc.) OR remove the arrows from the card header | Currently styled and accessible but no JS handler. Buyer-confusing if they click and nothing happens | Frontend lead | **Pending** |
| D-014 | Enterprise logos on `portfolio.html` | Commission / source logos for the 22 enterprise entities and drop into `images/logos/enterprise/`, OR keep text monograms as a deliberate visual treatment | Mixed treatment: government grid uses real logos (post-recent-upload); enterprise grid uses 2-3-letter text monograms. Inconsistency reads as unfinished. | Brand / marketing lead | **Pending** |
| D-015 | Hindi copy aria-label across 8 pages | Update from `"Language switcher (placeholder - Hindi copy not yet wired)"` to `"Language switcher (English / Hindi)"` | Currently misleads screen-reader users. Dictionary IS wired and translates nav, hero, footer, common section copy. | Accessibility / design lead | **Easy fix; doing now if approved** |
| D-016 | Design-system drift on `index.html` | Decide whether to re-align the hero (full-bleed Ashoka background) and case-card (italic Georgia serif title) back to the locked spec in [`docs/DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md) §7.5 / §7.4 — OR update the spec to make these the new canon | Drift items: hero overrides ~9 spec rules; case-card title font diverges from sect-head spec; saffron eyebrow color overridden via inline style 16+ times instead of token | Design lead | **Pending** |
| D-017 | `images/logos/enterprise/` directory | Create the directory + populate with logo files (matches the convention used for `images/logos/gov/`), OR remove the comment hint in `portfolio.html:129` | Comment promises a path that doesn't exist | Frontend lead | **Pending** |

---

## Roadmap dependencies (what blocks what)

```
D-001 (Ashoka legal)        ─┬─→  launch
D-002 (Privacy/Terms)        ─┤
D-003 (Contact form backend) ─┤
D-005 (Leadership)           ─┤
D-009 (entity approvals)     ─┤
                              │
D-004 (sector panels)       ──┤  partial — can launch with 1 sector fleshed if buyer journey routes around the others
D-007 (TBD certs)           ──┤  cosmetic — remove (TBD) labels and ship credentials.html
D-010 (photography)         ──┤  cosmetic — gradient placeholders are acceptable for v1
                              │
D-008 (portfolio nav)       ──┤  IA decision — affects nav markup site-wide
D-016 (design drift)        ──┤  internal consistency, no buyer impact
                              │
D-006, D-011, D-012, D-013   ──→  pre-launch polish (not blockers)
D-014, D-015, D-017          ──→  pre-launch polish (not blockers)
```

**Critical path to launch:**
1. D-001 (legal clearance on the Ashoka image) — outside dev control
2. D-002 (Privacy + Terms pages) — content + legal
3. D-003 (contact form backend) — engineering
4. D-005 (replace 3 leadership TBDs) — HR + content
5. D-009 (rolling approvals for entity references) — outside dev control

Everything else is polish or content depth and can ship in v1.1 / v1.2.

---

## Convention going forward

When a new TODO is added to code, it must:

1. Have a `WG` prefix in the comment (`<!-- TODO-WG: ... -->`)
2. State a clear acceptance criterion (what change resolves the TODO)
3. If non-trivial, get a row in this `MANUAL-DECISIONS.md` with an owner

No bare TODOs. No anonymous owners. No comment-only blockers.
