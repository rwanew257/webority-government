/*
 * Re-render specific cert PDFs at higher viewport scale for maximum sharpness.
 * Targets: CMMI Level 3 and ISO 27001:2022.
 * Run with: node scripts/pdf-to-png-sharper.cjs
 */
const path = require('path');
const fs = require('fs');

(async () => {
  const { pdfToPng } = require('pdf-to-png-converter');

  const SRC = path.join(process.env.USERPROFILE || 'C:\\Users\\WB0233-SURESH-RAWAT', 'Downloads');
  const DEST = path.join(__dirname, '..', 'images', 'credentials');

  const jobs = [
    { src: 'CMMI 3 Certificate.pdf', dest: 'cmmi-l3' },
    { src: 'Frame 1707486481.pdf',   dest: 'iso-27001-2022' },
  ];

  for (const job of jobs) {
    const inputPath = path.join(SRC, job.src);
    if (!fs.existsSync(inputPath)) {
      console.log(`SKIP  ${job.src} (not found)`);
      continue;
    }
    try {
      const pages = await pdfToPng(inputPath, {
        viewportScale: 5.0,    // 5x — ~4100px wide, max sharpness for these two
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
        console.log(`OK    ${job.dest}.png  (${sz} KB at 4x scale)`);
      }
    } catch (err) {
      console.log(`FAIL  ${job.src}  ${err.message}`);
    }
  }
})();
