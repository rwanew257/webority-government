/*
 * Convert certificate PDFs (in Downloads) to high-resolution PNGs
 * for the "Our Credentials at a Glance" section.
 * Run with: npx --package=pdf-to-png-converter -- node scripts/pdf-to-png.cjs
 */
const path = require('path');
const fs = require('fs');

(async () => {
  const { pdfToPng } = require('pdf-to-png-converter');

  const SRC = process.env.USERPROFILE
    ? path.join(process.env.USERPROFILE, 'Downloads')
    : 'C:\\Users\\WB0233-SURESH-RAWAT\\Downloads';
  const DEST = path.join(__dirname, '..', 'images', 'credentials');

  const conversions = [
    { src: 'Frame 1707487130.pdf',     dest: 'cmmi-l5' },
    { src: 'Frame 1707486478.pdf',     dest: 'cmmi-l3' },
    { src: 'ISO 9001_2015.pdf',        dest: 'iso-27001-2022' },  // mis-named PDF; content is 27001:2022
    { src: 'Frame 1707487131.pdf',     dest: 'iso-20000-2018' },
    { src: 'Frame 1707486473 (1).pdf', dest: 'startup-india' },
  ];

  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

  for (const job of conversions) {
    const inputPath = path.join(SRC, job.src);
    if (!fs.existsSync(inputPath)) {
      console.log(`SKIP  ${job.src} (file not found in ${SRC})`);
      continue;
    }
    try {
      const pages = await pdfToPng(inputPath, {
        viewportScale: 2.5,      // 2.5x = roughly 2000-2500px wide PNGs
        outputFolder: DEST,
        outputFileMask: job.dest,
        useSystemFonts: true,
      });
      // pdf-to-png-converter writes <mask>_page_1.png ; rename to <mask>.png
      const written = pages[0]?.path;
      if (written) {
        const target = path.join(DEST, `${job.dest}.png`);
        if (written !== target) {
          if (fs.existsSync(target)) fs.unlinkSync(target);
          fs.renameSync(written, target);
        }
        const sz = (fs.statSync(target).size / 1024).toFixed(1);
        console.log(`OK    ${job.dest}.png  (${sz} KB)`);
      } else {
        console.log(`WARN  ${job.src} produced 0 pages`);
      }
    } catch (err) {
      console.log(`FAIL  ${job.src}  ${err.message}`);
    }
  }
})();
