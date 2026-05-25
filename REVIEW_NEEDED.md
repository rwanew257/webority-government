# Webority Government — Items Needing Human Review

The scaffold is in good shape. These are the deliberate hand-offs.

---

## HIGHEST priority — added in the Main Frame mockup iteration

0. **State Emblem of India usage** &mdash; `index.html` hero image
   - The "Main Frame" mockup uses the Lion Capital of Ashoka (the State Emblem of India)
   - Commercial use is regulated under the **State Emblem of India (Prohibition of Improper Use) Act, 2005**. Penalties include fines and imprisonment
   - **Do not publish the site with the Ashoka Lions image until counsel has confirmed authorisation in writing**
   - If authorisation is not forthcoming, swap to a civic / infrastructure / governance-themed illustration that does not depict the State Emblem, the Ashoka Chakra, the national flag, or any other protected symbol
   - Inline marker: `TODO-WG (LEGAL REVIEW REQUIRED)` inside `index.html` above the `<img>` tag
   - Until an approved asset is dropped at `images/hero-public-sector.webp`, the page renders a dashed-border placeholder &mdash; safe to demo internally, not publishable externally

0a. **Empanelment claims on the homepage trust-badge row**
    - The five badges (Startup India &middot; DPIIT, CMMI Level 5, ISO Certified, GIGW Compliant, GeM Registered) are now visible on the public homepage
    - **Confirm each one is currently true** before publishing &mdash; particularly *"GIGW Compliant"* (the site has not yet been independently audited against GIGW 3.0) and the **GeM Registered** claim (seller ID not yet wired into the page). If any claim is aspirational rather than current, soften the wording or remove the badge
    - `credentials.html` has `TODO-WG` markers next to the GeM seller-ID and GIGW certificate fields

---

## HIGH priority

1. **Grievance officer designation** — `contact.html#grievance`
   - Level 2 row uses placeholder `grievance@webority.com` — confirm the address or replace
   - Level 3 row says "Designation pending" — the IT Rules 2021 and DPDP Act both require a named Grievance Officer with public contact details. Designate one and publish their name, official email, phone, postal address, and working hours
   - Search for: `TODO-WG` in `contact.html`

2. **Hindi translation wiring** — `js/lang-toggle.js`
   - The toggle currently only flips `aria-pressed` and `<html lang>`. It does **not** translate copy
   - Decide on a translation approach: hand-authored Hindi `.html` files (e.g. `index.hi.html`), a JSON i18n bundle, or a Bhashini-backed runtime
   - Once translations exist, extend `lang-toggle.js` to swap visible text

3. **National emblem / flag policy**
   - The top-bar badge uses a CSS-only decorative circle (a chakra-styled motif, **not** the Ashoka Chakra or Lion Capital)
   - Do **not** replace this with the State Emblem of India, the Ashoka Chakra, or the national flag without legal review under the State Emblem of India (Prohibition of Improper Use) Act, 2005, and the Prevention of Insults to National Honour Act, 1971
   - Decorative tricolour stripe (saffron / white / green) elements are generally acceptable, but check with counsel before using

---

## MEDIUM priority

4. **Empanelment dossier verification** — `contact.html`
   - The page states detailed compliance dossiers (CMMI L5 appraisal letter, ISO certificates, financials, past-performance) are shared on request. Confirm with the parent firm that these dossiers are current and assigned to a named contact
   - Confirm the **GeM-ready Vendor** pill on `index.html` and the **MSME Registered** pill are factually current

5. **Case studies** — `case-studies.html`
   - Verify every reference is a real public-sector engagement
   - Where genuine public-sector references do not yet exist, write *"Building our public-sector portfolio — early engagements available on request."* — do **not** fabricate clients

6. **Accessibility statement page** — currently missing
   - GIGW expects a dedicated `accessibility.html` declaring conformance level, known limitations, and reporting channel. Worth adding as a 7th page
   - Recommended structure: conformance claim, accessibility features used, known limitations, contact for accessibility feedback, last updated date

7. **Sitemap** — currently missing
   - GIGW expects both a `sitemap.xml` (machine) and a human-readable `sitemap.html`. With only 6 active pages this is a 10-minute job

---

## LOW priority

8. **Footer ribbon decoration** — `contact.html` footer
   - `<span class="ribbon">` with 3 child spans is described as `aria-hidden="true"` (good) but the visual treatment in `style.css` is not currently inspected; if it renders as a tricolour bar, confirm legal review per item 3 above

9. **Color contrast (WCAG 1.4.3)**
   - Primary `#6200ee` on white passes 4.5:1 only at 14pt+ bold or 18pt+ regular. Confirm no body text under 14px sits directly on the primary background, and that primary-colored links on white meet AA
   - Run Axe DevTools or Lighthouse on `index.html`, `contact.html`, and `services.html` and resolve any "serious" / "critical" hits

10. **Mobile responsiveness of top-bar**
    - On viewports under 640px the topbar hides the tagline and shrinks padding — verify on a real 360×640 device that the badge + lang toggle + quick links all fit without horizontal scroll

11. **Tab-order trap check**
    - Confirm `Tab` from the top of the page goes: skip-nav → topbar quick-links → EN/Hindi buttons → site logo → main nav → main content. The injected topbar inserts elements at the top of `<body>`, so tab order should be correct, but verify in a real browser

---

## Reference: where to look

| Concern | Files |
|---|---|
| All inline TODOs | `grep -r "TODO-WG" .` |
| Gov-bar injection marker | `grep -r "WG_GOV_BAR_MARK" .` |
| Hindi toggle logic | `js/lang-toggle.js` |
| Skip-nav + focus styles | `css/gov-identity.css` |
| Grievance section | `contact.html#grievance` |
