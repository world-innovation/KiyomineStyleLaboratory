const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ICON_DIR = path.join(__dirname, "..", "public", "icons");

const svgSource = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6c63ff"/>
      <stop offset="100%" style="stop-color:#4a43cc"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <circle cx="256" cy="210" r="80" fill="rgba(255,255,255,0.2)"/>
  <ellipse cx="256" cy="210" rx="50" ry="50" fill="rgba(255,255,255,0.85)"/>
  <rect x="249" y="260" width="14" height="90" rx="7" fill="rgba(255,255,255,0.85)"/>
  <ellipse cx="235" cy="320" rx="20" ry="10" fill="rgba(255,255,255,0.5)" transform="rotate(-30 235 320)"/>
  <ellipse cx="277" cy="305" rx="18" ry="9" fill="rgba(255,255,255,0.5)" transform="rotate(25 277 305)"/>
</svg>`;

const sizes = [48, 72, 96, 128, 144, 152, 192, 384, 512, 1024];

async function main() {
  if (!fs.existsSync(ICON_DIR)) fs.mkdirSync(ICON_DIR, { recursive: true });

  const buf = Buffer.from(svgSource);

  for (const size of sizes) {
    await sharp(buf, { density: 300 })
      .resize(size, size)
      .png()
      .toFile(path.join(ICON_DIR, `icon-${size}x${size}.png`));
    console.log(`  icon-${size}x${size}.png`);
  }

  await sharp(buf, { density: 300 })
    .resize(512, 512)
    .png()
    .toFile(path.join(ICON_DIR, "maskable-512x512.png"));
  console.log("  maskable-512x512.png");

  console.log(`\nDone! Generated ${sizes.length + 1} PNG icons.`);
}

main().catch(console.error);
