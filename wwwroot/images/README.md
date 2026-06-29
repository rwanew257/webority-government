# Image assets — Webority Government

Drop image files here as referenced by the HTML pages.

## Currently expected

| Filename | Where it's used | Notes |
|---|---|---|
| `hero-public-sector.jpg` | `index.html` hero (right column) | **Installed.** Extracted from `Main Frame.pdf` supplied by the user. Depicts the Lion Capital of Ashoka (State Emblem of India) on a tricolour watercolour background. **Legal sign-off still required before external publishing** &mdash; use of the State Emblem is regulated by the State Emblem of India (Prohibition of Improper Use) Act, 2005. Original size: 1024&times;615, ~528 KB JPEG. |

## What happens if the file is missing

`index.html` uses an `onerror` handler on the `<img>` tag — if `hero-public-sector.webp` is not found, the image hides itself and a dashed-border placeholder appears instead, so the layout doesn't collapse.

## Format & size guidance

- Prefer `.webp` (smaller files, well supported now)
- Target width 1240 px @ 2x DPR (rendered at 620 px max-width)
- Compress to under 120 KB where the image content allows
- Provide a meaningful `alt` attribute when swapping the image &mdash; update the `<img alt="...">` in `index.html` to describe the actual content
