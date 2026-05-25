const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT_PATH = path.join(__dirname, '..', 'images', 'our-story.jpg');
const W = 1400;
const H = 1050;

function ashokaChakra(cx, cy, r, opacity = 0.9) {
  let spokes = '';
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * Math.PI * 2;
    const x = cx + Math.cos(ang) * r;
    const y = cy + Math.sin(ang) * r;
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#0e1640" stroke-width="2" stroke-opacity="${opacity}"/>`;
  }
  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0e1640" stroke-width="4" stroke-opacity="${opacity}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="#0e1640" fill-opacity="${opacity}"/>
      ${spokes}
    </g>`;
}

function parliamentDome(cx, baseY, scale = 1) {
  const w = 720 * scale;
  const h = 380 * scale;
  const left = cx - w / 2;
  const top = baseY - h;

  let cols = '';
  const colCount = 18;
  const colArea = w * 0.78;
  const colStart = left + (w - colArea) / 2;
  const colW = colArea / (colCount * 1.8);
  const colGap = (colArea - colW * colCount) / (colCount - 1);
  for (let i = 0; i < colCount; i++) {
    const x = colStart + i * (colW + colGap);
    cols += `<rect x="${x}" y="${baseY - 110 * scale}" width="${colW}" height="${100 * scale}" fill="#1b1f3a" opacity="0.95"/>`;
  }

  return `
    <g>
      <ellipse cx="${cx}" cy="${baseY - 120 * scale}" rx="${w / 2}" ry="${12 * scale}" fill="#0e1228" opacity="0.5"/>
      <rect x="${left + w * 0.04}" y="${baseY - 14 * scale}" width="${w * 0.92}" height="${14 * scale}" fill="#1b1f3a"/>
      <rect x="${left}" y="${baseY - 4 * scale}" width="${w}" height="${4 * scale}" fill="#262b4d"/>
      ${cols}
      <rect x="${colStart - 12}" y="${baseY - 124 * scale}" width="${colArea + 24}" height="${14 * scale}" fill="#1b1f3a"/>
      <rect x="${cx - w * 0.32}" y="${baseY - 188 * scale}" width="${w * 0.64}" height="${64 * scale}" fill="#1b1f3a"/>
      <path d="M ${cx - w * 0.28} ${baseY - 188 * scale}
               Q ${cx} ${baseY - 360 * scale} ${cx + w * 0.28} ${baseY - 188 * scale} Z"
            fill="#1b1f3a"/>
      <path d="M ${cx - w * 0.26} ${baseY - 200 * scale}
               Q ${cx} ${baseY - 350 * scale} ${cx + w * 0.26} ${baseY - 200 * scale}"
            fill="none" stroke="#3a3f6b" stroke-width="1.5" opacity="0.6"/>
      <path d="M ${cx - w * 0.20} ${baseY - 240 * scale}
               Q ${cx} ${baseY - 340 * scale} ${cx + w * 0.20} ${baseY - 240 * scale}"
            fill="none" stroke="#3a3f6b" stroke-width="1.5" opacity="0.6"/>
      <rect x="${cx - 8}" y="${baseY - 380 * scale}" width="16" height="${30 * scale}" fill="#1b1f3a"/>
      <circle cx="${cx}" cy="${baseY - 388 * scale}" r="${8 * scale}" fill="#b48cff"/>
      <line x1="${cx}" y1="${baseY - 400 * scale}" x2="${cx}" y2="${baseY - 430 * scale}" stroke="#b48cff" stroke-width="2" opacity="0.6"/>
    </g>`;
}

function dataLines(startX, startY, color) {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const y = startY + i * 26;
    const len = 80 + (i * 37) % 140;
    const opacity = 0.18 + (i % 3) * 0.08;
    lines.push(`<line x1="${startX}" y1="${y}" x2="${startX + len}" y2="${y}" stroke="${color}" stroke-width="2" stroke-opacity="${opacity}"/>`);
    lines.push(`<circle cx="${startX + len + 8}" cy="${y}" r="2.5" fill="${color}" fill-opacity="${opacity + 0.2}"/>`);
  }
  return lines.join('');
}

function nodeChip(x, y, label, value) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="180" height="56" rx="10" ry="10" fill="#ffffff" fill-opacity="0.95" stroke="#7c4dff" stroke-opacity="0.25"/>
      <text x="${x + 16}" y="${y + 22}" font-family="Segoe UI, Arial, sans-serif" font-size="10" letter-spacing="2" font-weight="700" fill="#6a3df0">${label}</text>
      <text x="${x + 16}" y="${y + 44}" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="#0e1640">${value}</text>
    </g>`;
}

function makeSvg() {
  const cx = W * 0.55;
  const baseY = H * 0.78;

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f0eafd"/>
        <stop offset="55%" stop-color="#e2d7fa"/>
        <stop offset="100%" stop-color="#c7b3f1"/>
      </linearGradient>
      <radialGradient id="sun" cx="22%" cy="28%" r="22%">
        <stop offset="0%" stop-color="#ffd9a8" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="#ffb27a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ffb27a" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b8a3e8"/>
        <stop offset="100%" stop-color="#7d63c8"/>
      </linearGradient>
      <linearGradient id="head" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1a1140"/>
        <stop offset="100%" stop-color="#4a2db8"/>
      </linearGradient>
      <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
        <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#7c4dff" stroke-opacity="0.06" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect width="${W}" height="${H}" fill="url(#sun)"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>

    <g opacity="0.45">
      <path d="M 0 ${baseY + 60} Q ${W * 0.4} ${baseY} ${W} ${baseY + 80} L ${W} ${H} L 0 ${H} Z" fill="url(#ground)"/>
    </g>

    <g opacity="0.7">
      <line x1="${W * 0.06}" y1="${H * 0.18}" x2="${W * 0.06}" y2="${H * 0.38}" stroke="#7c4dff" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="4 6"/>
      <line x1="${W * 0.10}" y1="${H * 0.42}" x2="${W * 0.10}" y2="${H * 0.55}" stroke="#7c4dff" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="4 6"/>
      <line x1="${W * 0.94}" y1="${H * 0.18}" x2="${W * 0.94}" y2="${H * 0.30}" stroke="#7c4dff" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="4 6"/>
    </g>

    <g opacity="0.18">
      ${ashokaChakra(W * 0.18, H * 0.30, 110, 0.6)}
    </g>

    ${parliamentDome(cx, baseY, 1)}

    <g opacity="0.85">
      <circle cx="${cx}" cy="${baseY - 240}" r="170" fill="none" stroke="#6a3df0" stroke-width="1" stroke-opacity="0.45" stroke-dasharray="2 6"/>
      <circle cx="${cx}" cy="${baseY - 240}" r="220" fill="none" stroke="#6a3df0" stroke-width="1" stroke-opacity="0.30"/>
    </g>

    <g>
      ${nodeChip(W * 0.06, H * 0.50, 'PARLIAMENT OF INDIA', 'Sansad Bhavan')}
      ${nodeChip(W * 0.06, H * 0.62, 'MINISTRY ENGAGEMENTS', '10+ ministries')}
    </g>

    <g>
      ${nodeChip(W * 0.74, H * 0.30, 'COMPLIANCE STACK', 'VAPT - GIGW - ISO')}
      ${nodeChip(W * 0.74, H * 0.42, 'PROCUREMENT READY', 'GeM - CPPP - GFR')}
    </g>

    <g opacity="0.6">
      <line x1="${W * 0.18}" y1="${H * 0.52}" x2="${cx - 240}" y2="${baseY - 200}" stroke="#6a3df0" stroke-width="1.5" stroke-dasharray="3 5"/>
      <line x1="${W * 0.86}" y1="${H * 0.32}" x2="${cx + 230}" y2="${baseY - 220}" stroke="#6a3df0" stroke-width="1.5" stroke-dasharray="3 5"/>
      <circle cx="${cx - 240}" cy="${baseY - 200}" r="4" fill="#6a3df0"/>
      <circle cx="${cx + 230}" cy="${baseY - 220}" r="4" fill="#6a3df0"/>
    </g>

    <g>
      <rect x="60" y="64" width="14" height="3" fill="#ff8a3d"/>
      <rect x="78" y="64" width="14" height="3" fill="#ffffff" stroke="#0e1640" stroke-width="0.5"/>
      <rect x="96" y="64" width="14" height="3" fill="#13b454"/>
      <text x="60" y="100" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="4" fill="#6a3df0">OUR STORY</text>
      <text x="60" y="160" font-family="Georgia, serif" font-style="italic" font-size="46" fill="url(#head)">Built for India&#8217;s</text>
      <text x="60" y="214" font-family="Georgia, serif" font-style="italic" font-size="46" fill="url(#head)">Public Institutions.</text>
      <text x="60" y="252" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="#3a3060" opacity="0.85">Engineering for ministries, departments &amp; PSUs since 2012.</text>
    </g>

    <g transform="translate(${W - 360}, ${H - 200})">
      <rect x="0" y="0" width="300" height="140" rx="14" ry="14" fill="#ffffff" fill-opacity="0.92" stroke="#7c4dff" stroke-opacity="0.30"/>
      <text x="22" y="34" font-family="Segoe UI, Arial, sans-serif" font-size="10" letter-spacing="3" font-weight="700" fill="#6a3df0">SINCE 2012</text>
      <text x="22" y="92" font-family="Georgia, serif" font-style="italic" font-size="56" fill="#0e1640">10<tspan font-size="34" dx="4" fill="#6a3df0">+</tspan></text>
      <text x="120" y="78" font-family="Segoe UI, Arial, sans-serif" font-size="12" letter-spacing="2" font-weight="600" fill="#3a3060">YEARS DELIVERING</text>
      <text x="120" y="98" font-family="Segoe UI, Arial, sans-serif" font-size="12" letter-spacing="2" font-weight="600" fill="#3a3060">FOR THE PUBLIC</text>
      <text x="120" y="118" font-family="Segoe UI, Arial, sans-serif" font-size="12" letter-spacing="2" font-weight="600" fill="#3a3060">SECTOR</text>
    </g>

    <rect x="0" y="${H - 6}" width="${W * 0.33}" height="6" fill="#ff8a3d"/>
    <rect x="${W * 0.33}" y="${H - 6}" width="${W * 0.34}" height="6" fill="#ffffff"/>
    <rect x="${W * 0.67}" y="${H - 6}" width="${W * 0.33}" height="6" fill="#13b454"/>
  </svg>`;
}

async function main() {
  const svg = Buffer.from(makeSvg());
  await sharp(svg).jpeg({ quality: 90 }).toFile(OUT_PATH);
  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${Math.round(stat.size / 1024)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
