/*
 * Crop the top portion of the 4 case-study images to remove the baked-in
 * "MINISTRY OF X" text chip. The CSS chip overlay (.case-card-ministry)
 * replaces it on the rendered page.
 *
 * The text chip occupies approximately the top 80 px (around 12-14% of
 * a ~600 px tall image). Removing it leaves the phones visible.
 *
 * Run with: node scripts/crop-case-images.cjs
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'images', 'case-studies');
const files = [
  'ministry-of-power.png',
  'parliamentary-affairs.png',
  'ministry-of-defence.png',
  'ministry-of-tribal-affairs.png',
];

// How many pixels to lop off the top — chosen to comfortably clear the chip
// without cropping into the phone mockups.
const CROP_TOP_PX = 80;

(async () => {
  for (const f of files) {
    const inPath = path.join(DIR, f);
    if (!fs.existsSync(inPath)) {
      console.log(`SKIP  ${f}  (not found)`);
      continue;
    }
    try {
      const meta = await sharp(inPath).metadata();
      // Extract from y = CROP_TOP_PX to the bottom; keep full width.
      const cropped = await sharp(inPath)
        .extract({
          left: 0,
          top: CROP_TOP_PX,
          width: meta.width,
          height: meta.height - CROP_TOP_PX,
        })
        .png({ compressionLevel: 9 })
        .toBuffer();
      // Overwrite the original (sharp can't read+write the same file in one call).
      fs.writeFileSync(inPath, cropped);
      const newMeta = await sharp(inPath).metadata();
      const newSize = (fs.statSync(inPath).size / 1024).toFixed(1);
      console.log(`OK    ${f}  (${meta.width}x${meta.height} -> ${newMeta.width}x${newMeta.height}, ${newSize} KB)`);
    } catch (err) {
      console.log(`FAIL  ${f}  ${err.message}`);
    }
  }
})();
