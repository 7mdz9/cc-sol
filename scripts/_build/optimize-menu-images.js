import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = "public/assets/menu";
const outputDir = "public/assets/menu/optimized";
const sizes = [480, 800, 1200];

await fs.mkdir(outputDir, { recursive: true });

const files = (await fs.readdir(sourceDir)).filter((file) => file.endsWith(".jpg"));

for (const file of files) {
  const sourcePath = path.join(sourceDir, file);
  const id = path.parse(file).name;

  for (const width of sizes) {
    const height = Math.round(width * 1.5);
    const image = sharp(sourcePath).resize({
      width,
      height,
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    });

    await image
      .clone()
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(outputDir, `${id}-${width}.webp`));

    await image
      .clone()
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(path.join(outputDir, `${id}-${width}.jpg`));
  }
}

console.log(`optimized ${files.length} images into ${outputDir}`);

