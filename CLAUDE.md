@~/.claude/conventions/dotnet.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An **ASP.NET Core (`net10.0`) Razor Pages** marketing website for Webority Technologies' Indian public-sector ("Government") practice. It is a real .NET web app with a build step — not a static site.

```
dotnet build                 # TreatWarningsAsErrors=true — warnings fail the build
dotnet run                   # serves https://localhost:7050 (ASPNETCORE_ENVIRONMENT=Development)
```

Project: `Webority.Web.GovIndia` (`Webority.Web.GovIndia.csproj` / `.sln`). Health check at `/health`.

The `node`/`package.json` dependencies (`sharp`, `pdf-to-png-converter`) and `scripts/*.cjs` are **left over from the prior static site** — one-off, manually-run image-generation utilities. They are **not** part of the .NET build or runtime.

## Architecture

### Razor Pages + single shared layout
Pages live under `Pages/` as `.cshtml` + `.cshtml.cs` pairs. Header, nav, mega-menu, and footer are defined **once** in `Pages/Shared/_Layout.cshtml` (`_ViewStart.cshtml` sets it as the default layout). Edit shared chrome there — it is **not** duplicated per page.

Page-level metadata is passed to the layout via `ViewData` keys set in each page's `@{ }` block: `Title`, `Description`, `ActiveNav` (highlights the active nav item), `BodyClass` (per-page `<body>` class).

`_ViewImports.cshtml` registers tag helpers from `Microsoft.AspNetCore.Mvc.TagHelpers`, `LigerShark.WebOptimizer.Core`, and the vendored `Webority.Web.Common`.

### Routing — kebab-case slugs, lowercase, no trailing slash
A `KebabCasePageRouteModelConvention` (from `Webority.Web.Common`, wired in `AddWeborityRazorPages`) maps PascalCase page paths to kebab-case URLs:
- `Pages/AboutUs.cshtml` → `/about-us`
- `Pages/Services/Cybersecurity.cshtml` → `/services/cybersecurity`
- `Pages/CaseStudies/Manthan.cshtml` → `/case-studies/manthan`

`AddRouting` sets `LowercaseUrls = true`, `AppendTrailingSlash = false`, and `UseWeborityUrlRewriting` issues **301 redirects** to the canonical lowercase, no-trailing-slash form. Always link with the `asp-page` tag helper (e.g. `asp-page="/AboutUs"`) — it generates the correct kebab-case URL; never hardcode hrefs.

### Vendored dependency — `lib/Webority.Web.Common.dll`
Shared Webority web infrastructure is referenced as a **binary** (`<Reference HintPath="lib\...">`), not a project or NuGet package. Because assembly references don't flow transitive NuGet, its closure (`System.Linq.Dynamic.Core`, `HtmlSanitizer`, `libphonenumber-csharp`, `Azure.Monitor.OpenTelemetry.AspNetCore`) is **hand-listed** in the csproj — keep it in sync if the DLL is updated. It provides the `AddWebority*` / `UseWebority*` extension methods used in `Startup.cs` (cookies/antiforgery, kebab routing, sitemap + attribute-based redirects, response compression, static-file caching + image CORS, SEO protection, URL rewriting, `.well-known` files).

### Configuration
- `appsettings.json` + per-environment `appsettings.{Development,Staging,Production}.json`.
- `sharedsettings.json` (repo root) is loaded in `Program.cs` from `AppContext.BaseDirectory` as **non-optional** (app won't start without it); the csproj copies `sharedsettings*.json` to the build output. It carries a shared `Version`.
- `*.local.json` and `secrets.json` are git-ignored — put machine-local overrides there, never in the tracked appsettings.

### Static assets & runtime bundling (WebOptimizer)
All CSS/JS/images live under `wwwroot/`. `Startup.cs` configures **runtime bundling + minification** via `LigerShark.WebOptimizer`; the layout references the bundles, not the individual files:
- `/css/bundle.css` ← `vendor/bootstrap/bootstrap.min.css`, `style.css`, `gov-identity.css`, `design-polish.css`, `responsive.css`
- `/js/bundle.js` ← `vendor/bootstrap/bootstrap.bundle.min.js`, `main.js`, `i18n-dict.js`, `lang-toggle.js`

**Source order in the bundles is load-bearing** (see below). Per-page assets are injected via layout render sections, not the global bundle: `@section HeadStyles { <link href="~/css/pages/..." /> }` and `@section BodyScripts { ... }`. Per-page files live in `wwwroot/css/pages/` and `wwwroot/js/pages/`.

### CSS cascade — order is load-bearing
The bundle links these in a fixed order; **later files intentionally override earlier ones**:
1. `css/style.css` — original hand-built base. Layout, the `--primary: #6200ee` token, most components. Historically "do not modify".
2. `css/gov-identity.css` — government identity layer: skip-nav link, `:focus-visible` outlines, language-toggle styling.
3. `css/design-polish.css` — largest file; most recent visual refinements.
4. `css/responsive.css` — **all** `@media` rules for the whole site, loaded **last** so responsive rules win. Breakpoints normalised to exactly **1400 / 1200 / 991 / 768 / 575** (Bootstrap-style), ordered `max-width` descending → ranges → `min-width` ascending → `prefers-reduced-motion`. The other three stylesheets contain **no `@media` blocks** — add responsive behaviour here, keeping to the five breakpoints.

When adjusting base styles, prefer adding to `design-polish.css` to preserve override order; only touch `style.css` for genuinely foundational changes. Responsive/breakpoint rules go in `responsive.css`.

### i18n is text-node translation, not key-based
`js/lang-toggle.js` does **not** rely on `data-i18n` attributes (some exist in markup but are vestigial). It walks every text node under `<body>` with a `TreeWalker`, looks up the node's **trimmed English text** as a key in `WG_I18N_HI` (defined in `js/i18n-dict.js`, which must bundle **before** the toggle), swaps in the Hindi value, and snapshots the original English (via `WeakMap`) so toggling back restores it.
- To translate new copy, add an entry to `js/i18n-dict.js` keyed by the **exact trimmed English string** on the page. No markup change needed.
- Missing keys fall back to English.
- Nodes inside `SCRIPT/STYLE/CODE/PRE/TEXTAREA/INPUT/SELECT/OPTION`, anything with `.gov-lang-toggle`, and anything marked `data-no-i18n` are skipped. Use `data-no-i18n` to protect proper nouns / brand names / standards codes.
- Language choice persists in `localStorage` under `wg-lang`.

## Conventions specific to this repo

- **`TODO-WG`** marks every spot deliberately handed off for human review (placeholder emails, unverified compliance claims, legal sign-offs). Find them all: `grep -rn "TODO-WG" Pages wwwroot`. Do not silently resolve or remove these — they gate publication.
- `CHANGES.md` is a narrative changelog and `REVIEW_NEEDED.md` / `docs/audit/*` track outstanding decisions — consult them before assuming why something is the way it is. (Some predate the .NET migration and describe the former static site.)

## Domain caution: regulated national symbols

This is an Indian-government-facing site. The **State Emblem of India (Lion Capital of Ashoka), the Ashoka Chakra, and the national flag are legally protected** (State Emblem of India (Prohibition of Improper Use) Act 2005; Prevention of Insults to National Honour Act 1971). Existing decorative marks are deliberately *chakra-styled motifs, not the real emblem*. Do not introduce the actual State Emblem, Ashoka Chakra, or flag imagery, and flag any request to do so for legal review (see `REVIEW_NEEDED.md`). Compliance/empanelment badges (CMMI L5, ISO, GIGW, GeM, Startup India) are claims that must be verified true before publishing — treat them as `TODO-WG`-gated.

## Editing notes

- Some files are UTF-8 with a BOM, and a few contain mojibake from earlier encoding round-trips (e.g. `â€"` for an em-dash). Preserve a file's existing encoding when editing rather than mass-rewriting it.
- Shared chrome lives in **one** place now (`Pages/Shared/_Layout.cshtml`) — no per-page duplication to keep in sync.
