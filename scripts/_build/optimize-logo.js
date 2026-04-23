import sharp from "sharp";

const mainSrc = "public/assets/logo-original.png";
const circleSrc = "public/assets/logo-circle.png";
const targetWidth = 3192;
const navTargetWidth = 256;

const mainImage = sharp(mainSrc).resize({ width: targetWidth, withoutEnlargement: true });
const navImage = sharp(mainSrc).resize({ width: navTargetWidth, withoutEnlargement: true });
const circleImage = sharp(circleSrc);

await mainImage
  .clone()
  .webp({ quality: 100 })
  .toFile("public/assets/logo.webp");

await mainImage
  .clone()
  .png({ compressionLevel: 9, palette: false, quality: 100 })
  .toFile("public/assets/logo.png");

await navImage
  .clone()
  .webp({ quality: 100 })
  .toFile("public/assets/logo-nav.webp");

await navImage
  .clone()
  .png({ compressionLevel: 9, palette: false, quality: 100 })
  .toFile("public/assets/logo-nav.png");

await circleImage
  .clone()
  .webp({ quality: 100 })
  .toFile("public/assets/logo-circle.webp");
