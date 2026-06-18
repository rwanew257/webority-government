#!/usr/bin/env node
/*
 * One-off: regroup css/responsive.css so every block sharing a breakpoint is
 * merged into a single @media, ordered:
 *   max-width  : 1400 -> 1200 -> 991 -> 768 -> 575   (desktop-first, descending)
 *   ranges     : (min .. max) blocks
 *   min-width  : 575 -> 768 -> 991 -> 1200 -> 1400    (mobile-first, ascending)
 *   prefers-reduced-motion (merged)
 * Within each merged block, original source order is preserved.
 *
 * Run from repo root:  node scripts/regroup-responsive.cjs
 */
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '..', 'css/responsive.css');
const s = fs.readFileSync(FILE, 'utf8');
const n = s.length;

// --- parse top-level @media blocks (comment/string aware) ---
const blocks = [];
let i = 0;
while (i < n) {
  if (s[i] === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e === -1 ? n : e + 2; continue; }
  if (s.startsWith('@media', i)) {
    const braceOpen = s.indexOf('{', i);
    const cond = s.slice(i, braceOpen);
    let depth = 0, p = braceOpen;
    for (; p < n; p++) {
      const c = s[p];
      if (c === '/' && s[p + 1] === '*') { const e = s.indexOf('*/', p + 2); p = e === -1 ? n : e + 1; continue; }
      if (c === '"' || c === "'") { let j = p + 1; while (j < n && s[j] !== c) { if (s[j] === '\\') j++; j++; } p = j; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { p++; break; } }
    }
    const inner = s.slice(braceOpen + 1, p - 1).replace(/^\s*\n/, '').replace(/\s+$/, '');
    blocks.push({ cond, inner });
    i = p;
    continue;
  }
  i++;
}

// --- classify + canonical condition ---
function classify(cond) {
  const mins = [...cond.matchAll(/min-width:\s*(\d+)px/g)].map((m) => +m[1]);
  const maxs = [...cond.matchAll(/max-width:\s*(\d+)px/g)].map((m) => +m[1]);
  if (/prefers-reduced-motion/.test(cond)) return { kind: 'motion', key: 'motion', canon: '@media (prefers-reduced-motion: reduce)' };
  if (mins.length && maxs.length) {
    const a = mins[0], b = maxs[0];
    return { kind: 'range', key: `range:${a}:${b}`, canon: `@media (min-width: ${a}px) and (max-width: ${b}px)`, bp: b };
  }
  if (maxs.length) return { kind: 'max', key: `max:${maxs[0]}`, canon: `@media (max-width: ${maxs[0]}px)`, bp: maxs[0] };
  if (mins.length) return { kind: 'min', key: `min:${mins[0]}`, canon: `@media (min-width: ${mins[0]}px)`, bp: mins[0] };
  return { kind: 'other', key: cond.trim(), canon: cond.trim() };
}

// --- merge by canonical key, preserving order of appearance ---
const groups = new Map(); // key -> {meta, inners:[]}
for (const b of blocks) {
  const meta = classify(b.cond);
  if (!groups.has(meta.key)) groups.set(meta.key, { meta, inners: [] });
  groups.get(meta.key).inners.push(b.inner);
}

const all = [...groups.values()];
const maxG = all.filter((g) => g.meta.kind === 'max').sort((a, b) => b.meta.bp - a.meta.bp);
const rangeG = all.filter((g) => g.meta.kind === 'range').sort((a, b) => b.meta.bp - a.meta.bp);
const minG = all.filter((g) => g.meta.kind === 'min').sort((a, b) => a.meta.bp - b.meta.bp);
const motionG = all.filter((g) => g.meta.kind === 'motion');

function emit(g) {
  const body = g.inners.join('\n\n');
  return `${g.meta.canon} {\n${body}\n}`;
}

const out = [];
out.push(`/*
 * responsive.css — consolidated responsive layer.
 * Every @media block from style.css, gov-identity.css and design-polish.css.
 * Breakpoints normalised to: 1400 / 1200 / 991 / 768 / 575.
 * Blocks merged by breakpoint, in cascade-correct order:
 *   max-width DESC (1400->575) | ranges | min-width ASC (575->1400) | reduced-motion.
 * MUST load LAST so its media rules win the cascade. See CLAUDE.md.
 */`);

out.push('\n/* ============================================================\n   max-width (desktop-first, largest -> smallest)\n   ============================================================ */');
for (const g of maxG) out.push('\n' + emit(g));

if (rangeG.length) {
  out.push('\n/* ============================================================\n   ranged (min-width .. max-width)\n   ============================================================ */');
  for (const g of rangeG) out.push('\n' + emit(g));
}

out.push('\n/* ============================================================\n   min-width (mobile-first, smallest -> largest)\n   ============================================================ */');
for (const g of minG) out.push('\n' + emit(g));

if (motionG.length) {
  out.push('\n/* ============================================================\n   reduced motion\n   ============================================================ */');
  for (const g of motionG) out.push('\n' + emit(g));
}

fs.writeFileSync(FILE, out.join('\n') + '\n');

console.log('Merged into:');
console.log('  max-width :', maxG.map((g) => `${g.meta.bp}(${g.inners.length})`).join(' '));
console.log('  ranges    :', rangeG.map((g) => `${g.meta.canon.replace('@media ', '')}(${g.inners.length})`).join(' '));
console.log('  min-width :', minG.map((g) => `${g.meta.bp}(${g.inners.length})`).join(' '));
console.log('  motion    :', motionG.map((g) => `merged(${g.inners.length})`).join(' '));
console.log(`Total source blocks: ${blocks.length} -> ${all.length} merged @media blocks.`);
