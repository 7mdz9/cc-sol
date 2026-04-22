import sharp from "sharp";

const src = "public/assets/logo-original.png";

const image = sharp(src);

await image
  .clone()
  .webp({ quality: 92 })
  .toFile("public/assets/logo.webp");

await image
  .clone()
  .png({ compressionLevel: 9, palette: true, quality: 95 })
  .toFile("public/assets/logo.png");
