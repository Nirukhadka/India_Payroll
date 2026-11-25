const fs = require('fs');
const { PNG } = require('pngjs');

const refBuffer = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-employee-reference/phase-10/reference-greythr-employee-overview-1920x1080.png');
const localBuffer = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-employee-reference/phase-10/local-indiapay-employee-overview-1920x1080.png');

const img1 = PNG.sync.read(refBuffer);
const img2 = PNG.sync.read(localBuffer);

const width = Math.min(img1.width, img2.width);
const height = Math.min(img1.height, img2.height);

const diff = new PNG({ width, height });
const overlay = new PNG({ width, height });

let diffCount = 0;
const totalPixels = width * height;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const r1 = img1.data[idx];
    const g1 = img1.data[idx + 1];
    const b1 = img1.data[idx + 2];
    const a1 = img1.data[idx + 3];

    const r2 = img2.data[idx];
    const g2 = img2.data[idx + 1];
    const b2 = img2.data[idx + 2];
    const a2 = img2.data[idx + 3];

    // 50% overlay
    overlay.data[idx] = Math.round((r1 + r2) / 2);
    overlay.data[idx + 1] = Math.round((g1 + g2) / 2);
    overlay.data[idx + 2] = Math.round((b1 + b2) / 2);
    overlay.data[idx + 3] = 255;

    // Difference check (color threshold 25)
    const delta = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    if (delta > 25) {
      diffCount++;
      diff.data[idx] = 255; // Red
      diff.data[idx + 1] = 0;
      diff.data[idx + 2] = 0;
      diff.data[idx + 3] = 255;
    } else {
      diff.data[idx] = Math.round(r1 * 0.3);
      diff.data[idx + 1] = Math.round(g1 * 0.3);
      diff.data[idx + 2] = Math.round(b1 * 0.3);
      diff.data[idx + 3] = 255;
    }
  }
}

fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-employee-reference/phase-10/employee-overview-overlay-50.png', PNG.sync.write(overlay));
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-employee-reference/phase-10/employee-overview-pixel-diff.png', PNG.sync.write(diff));

const matchPct = ((totalPixels - diffCount) / totalPixels * 100).toFixed(2);
console.log(`Comparison finished: ${matchPct}% match (${totalPixels - diffCount}/${totalPixels} pixels match)`);
