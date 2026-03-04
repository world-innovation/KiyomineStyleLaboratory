const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, "..", "public", "icons");

const makeSvgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6c63ff"/>
      <stop offset="100%" style="stop-color:#4a43cc"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <circle cx="256" cy="240" r="100" fill="rgba(255,255,255,0.25)"/>
  <circle cx="256" cy="240" r="60" fill="rgba(255,255,255,0.9)"/>
  <rect x="248" y="280" width="16" height="80" rx="8" fill="rgba(255,255,255,0.9)"/>
  <rect x="228" y="310" width="56" height="16" rx="8" fill="rgba(255,255,255,0.7)"/>
</svg>`;

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const size of sizes) {
  const svg = makeSvgIcon(size);
  fs.writeFileSync(path.join(outDir, `icon-${size}x${size}.svg`), svg);
}

console.log(`Generated ${sizes.length} icon SVGs in ${outDir}`);
console.log("NOTE: For App Store submission, convert these to PNG using a tool like sharp, Sketch, or Figma.");
console.log("Required: 1024x1024 PNG for App Store Connect.");
