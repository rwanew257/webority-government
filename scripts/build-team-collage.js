const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = path.join(__dirname, '..', 'images', 'team');
const OUT_PATH = path.join(__dirname, '..', 'images', 'team-collage.jpg');

const W = 1200;
const H = 900;

const PORTRAITS = [
  { file: 'ashraf-hussain.jpg' },
  { file: 'gurpreet-singh.jpg' },
  { file: 'navneet-singh.jpg' },
];

async function buildBackground() {
  return sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 26, g: 18, b: 56, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="g1" cx="20%" cy="30%" r="60%">
                <stop offset="0%" stop-color="#6a3df0" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#6a3df0" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="g2" cx="80%" cy="70%" r="55%">
                <stop offset="0%" stop-color="#0e8a4a" stop-opacity="0.55"/>
                <stop offset="100%" stop-color="#0e8a4a" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="g3" cx="50%" cy="100%" r="60%">
                <stop offset="0%" stop-color="#ff8a3d" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#ff8a3d" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0a0820" stop-opacity="0.0"/>
                <stop offset="100%" stop-color="#0a0820" stop-opacity="0.55"/>
              </linearGradient>
            </defs>
            <rect width="${W}" height="${H}" fill="#0e0a28"/>
            <rect width="${W}" height="${H}" fill="url(#g1)"/>
            <rect width="${W}" height="${H}" fill="url(#g2)"/>
            <rect width="${W}" height="${H}" fill="url(#g3)"/>
            <rect width="${W}" height="${H}" fill="url(#vignette)"/>
          </svg>`
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();
}

async function preparePortrait(filePath, size) {
  return sharp(filePath)
    .resize({ width: size, height: size, fit: 'cover', position: 'top' })
    .toBuffer();
}

async function roundedMask(size, radius) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>
  </svg>`;
  return Buffer.from(svg);
}

async function makePortraitCard(filePath, size, radius) {
  const portrait = await preparePortrait(filePath, size);
  const mask = await roundedMask(size, radius);
  return sharp(portrait)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function main() {
  const bg = await buildBackground();

  const cardSize = 300;
  const radius = 22;

  const cards = await Promise.all(
    PORTRAITS.map((p) =>
      makePortraitCard(path.join(SRC_DIR, p.file), cardSize, radius)
    )
  );

  const gap = 24;
  const totalW = cardSize * 3 + gap * 2;
  const startX = Math.round((W - totalW) / 2);
  const baseY = H - cardSize - 110;

  const composites = cards.map((buf, i) => ({
    input: buf,
    left: startX + i * (cardSize + gap),
    top: baseY + (i === 1 ? -28 : 0),
  }));

  const captionSvg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .eyebrow { font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 700; fill: #c4a8ff; letter-spacing: 4px; }
        .head { font-family: 'Georgia', serif; font-style: italic; font-size: 54px; font-weight: 400; fill: #ffffff; }
        .badge { font-family: 'Segoe UI', sans-serif; font-size: 13px; font-weight: 700; fill: #ffffff; letter-spacing: 3px; }
      </style>
      <text x="60" y="90" class="eyebrow">THE DELIVERY TEAM</text>
      <text x="60" y="158" class="head">Engineering for India&#8217;s</text>
      <text x="60" y="218" class="head">public institutions.</text>
      <rect x="60" y="${H - 70}" width="170" height="34" rx="17" ry="17" fill="rgba(255,255,255,0.08)" stroke="rgba(196,168,255,0.4)" stroke-width="1"/>
      <text x="145" y="${H - 47}" class="badge" text-anchor="middle">SINCE 2012</text>
    </svg>`
  );

  await sharp(bg)
    .composite([...composites, { input: captionSvg, top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toFile(OUT_PATH);

  const stat = fs.statSync(OUT_PATH);
  console.log(`Wrote ${OUT_PATH} (${Math.round(stat.size / 1024)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
