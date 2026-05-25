/*
 * Convert the 4 case-study PDFs to high-res PNGs.
 * Run: node scripts/case-pdfs-to-png.cjs
 */
const path = require('path');
const fs = require('fs');

(async () => {
  const { pdfToPng } = require('pdf-to-png-converter');

  const SRC  = path.join(process.env.USERPROFILE || '', 'Downloads');
  const DEST = path.join(__dirname, '..', 'images', 'case-studies');
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

  const jobs = [
    { src: 'Frame 2147224298.pdf', dest: 'bee-star-label' },
    { src: 'Frame 2147224299.pdf', dest: 'sansad-cafeteria' },
    { src: 'Frame 2147224607.pdf', dest: 'manthan-application' },
    { src: 'Frame 2147224301.pdf', dest: 'nbt-ecommerce' },
  ];

  for (const job of jobs) {
    const inputPath = path.join(SRC, job.src);
    if (!fs.existsSync(inputPath)) {
      console.log(`SKIP  ${job.src} (not found)`);
      continue;
    }
    try {
      const pages = await pdfToPng(inputPath, {
        viewportScale: 2.0,
        outputFolder: DEST,
        outputFileMask: job.dest,
        useSystemFonts: true,
        disableFontFace: false,
      });
      const written = pages[0]?.path;
      if (written) {
        const target = path.join(DEST, `${job.dest}.png`);
        if (written !== target) {
          if (fs.existsSync(target)) fs.unlinkSync(target);
          fs.renameSync(written, target);
        }
        const sz = (fs.statSync(target).size / 1024).toFixed(1);
        console.log(`OK    ${job.dest}.png  (${sz} KB)`);
      }
    } catch (err) {
      console.log(`FAIL  ${job.src}  ${err.message}`);
    }
  }
})();
