#!/usr/bin/env node
/*
 * One-off: pull every @media block out of style.css, gov-identity.css and
 * design-polish.css into a single css/responsive.css, snapping each width
 * breakpoint to one of {1400,1200,991,768,575}. prefers-reduced-motion blocks
 * move verbatim. Also links responsive.css (last) into every page.
 *
 * Run from repo root:  node scripts/extract-responsive.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCES = ['css/style.css', 'css/gov-identity.css', 'css/design-polish.css'];

// Approved nearest-tier bands (see AskUserQuestion preview):
//   <=640 -> 575 | <=820 -> 768 | <=1100 -> 991 | <=1300 -> 1200 | else 1400
function snap(n) {
  if (n <= 640) return 575;
  if (n <= 820) return 768;
  if (n <= 1100) return 991;
  if (n <= 1300) return 1200;
  return 1400;
}

// Remap every "<num>px" inside a media-condition string.
function remapCondition(cond) {
  return cond.replace(/(\d+)px/g, (m, d) => snap(parseInt(d, 10)) + 'px');
}

// Scan `s`, splitting into the cleaned source (media blocks removed) and the
// list of extracted media blocks (condition remapped). Comment/string aware.
function extract(s) {
  const out = [];      // cleaned source chars
  const blocks = [];   // extracted @media blocks
  const n = s.length;
  let i = 0;
  while (i < n) {
    // line comment? css has none, skip. block comment:
    if (s[i] === '/' && s[i + 1] === '*') {
      const end = s.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      out.push(s.slice(i, stop));
      i = stop;
      continue;
    }
    if (s[i] === '"' || s[i] === "'") {
      const q = s[i];
      let j = i + 1;
      while (j < n && s[j] !== q) { if (s[j] === '\\') j++; j++; }
      out.push(s.slice(i, j + 1));
      i = j + 1;
      continue;
    }
    if (s.startsWith('@media', i)) {
      // condition runs up to the first '{'
      const braceOpen = s.indexOf('{', i);
      const cond = s.slice(i, braceOpen);
      // brace-match the block body (comment/string aware)
      let depth = 0, p = braceOpen;
      for (; p < n; p++) {
        const c = s[p];
        if (c === '/' && s[p + 1] === '*') { const e = s.indexOf('*/', p + 2); p = e === -1 ? n : e + 1; continue; }
        if (c === '"' || c === "'") { let j = p + 1; while (j < n && s[j] !== c) { if (s[j] === '\\') j++; j++; } p = j; continue; }
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { p++; break; } }
      }
      const body = s.slice(braceOpen, p);
      blocks.push(remapCondition(cond) + body);
      i = p;
      continue;
    }
    out.push(s[i]);
    i++;
  }
  // tidy: collapse 3+ blank lines left behind into one blank line
  const cleaned = out.join('').replace(/\n[ \t]*\n[ \t]*\n+/g, '\n\n');
  return { cleaned, blocks };
}

const sections = [];
let total = 0;
for (const rel of SOURCES) {
  const file = path.join(ROOT, rel);
  const src = fs.readFileSync(file, 'utf8');
  const { cleaned, blocks } = extract(src);
  total += blocks.length;
  console.log(`${rel}: extracted ${blocks.length} @media blocks`);
  if (blocks.length) {
    sections.push(`/* ===== from ${rel} (${blocks.length} blocks) ===== */\n\n` + blocks.join('\n\n'));
  }
  fs.writeFileSync(file, cleaned);
}

const header = `/*
 * responsive.css — consolidated responsive layer.
 * Every @media block from style.css, gov-identity.css and design-polish.css
 * lives here, in that source order. Width breakpoints are normalised to:
 *   1400 / 1200 / 991 / 768 / 575
 * MUST load LAST so its media rules win the cascade. See CLAUDE.md.
 */
`;
fs.writeFileSync(path.join(ROOT, 'css/responsive.css'), header + '\n' + sections.join('\n\n\n') + '\n');
console.log(`\nWrote css/responsive.css with ${total} blocks total.`);

// --- link responsive.css (last) into every page ---
const LINK = '  <link rel="stylesheet" href="css/design-polish.css" />';
const NEW = LINK + '\n  <link rel="stylesheet" href="css/responsive.css" />';
let patched = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith('.html')) continue;
  const file = path.join(ROOT, f);
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('css/responsive.css')) continue;
  if (!html.includes(LINK)) { console.log(`!! ${f}: design-polish link not found, skipped`); continue; }
  html = html.replace(LINK, NEW);
  fs.writeFileSync(file, html);
  patched++;
}
console.log(`Linked responsive.css into ${patched} HTML files.`);
