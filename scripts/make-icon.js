const sharp = require("sharp");

const size = 32;
const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="#050a10"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#3ec4f5">S</text>
</svg>`,
);

sharp(svg)
  .png()
  .toFile("app/icon.png")
  .then(() => console.log("icon ok"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
