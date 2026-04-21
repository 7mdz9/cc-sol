import sharp from "sharp";

const src = "public/assets/logo-original.png";
const targetWidth = 560;

const image = sharp(src).resize({
  width: targetWidth,
  withoutEnlargement: true,
});

await image
  .clone()
  .webp({ quality: 42, alphaQuality: 68, effort: 6 })
  .toFile("public/assets/logo.webp");

await image
  .clone()
  .png({ compressionLevel: 9, palette: true, effort: 10 })
  .toFile("public/assets/logo.png");
