import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const PORCELAIN = "#EEE9E4";
const OLIVE = "#4D4738";
const STONE_MOSS = "#6D705A";

const dmSerifUrl = "https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFnOHM81r4j6k0gjAW3mujVU2B2K_c.ttf";
const inter500Url = "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf";

const assetDir = "public/assets";
const cacheDir = join(tmpdir(), "solea-asset-fonts");

async function ensureFont(url, filename) {
  await mkdir(cacheDir, { recursive: true });
  const target = join(cacheDir, filename);
  try {
    await readFile(target);
    return target;
  } catch {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to download font: ${url}`);
    }
    await writeFile(target, Buffer.from(await response.arrayBuffer()));
    return target;
  }
}

async function pngFromSvg(svgPath, size) {
  return sharp(svgPath).resize(size, size).png().toBuffer();
}

function createIco(images) {
  const headerSize = 6 + images.length * 16;
  let offset = headerSize;
  const buffers = [Buffer.alloc(headerSize)];
  const header = buffers[0];
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  images.forEach(({ size, buffer }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(buffer.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
    buffers.push(buffer);
  });

  return Buffer.concat(buffers);
}

async function textLayer({ text, fontfile, font, width, height, align = "center" }) {
  return sharp({
    text: {
      text,
      font,
      fontfile,
      width,
      height,
      align,
      rgba: true,
      spacing: 0,
      markup: true,
    },
  })
    .png()
    .toBuffer();
}

async function makeOgImage() {
  const dmSerif = await ensureFont(dmSerifUrl, "dm-serif-display-regular.ttf");
  const inter500 = await ensureFont(inter500Url, "inter-500.ttf");
  const source = await readFile(`${assetDir}/og-source.svg`, "utf8");
  const baseSvg = source.replace(/<g id="text-layer">[\s\S]*?<\/g>/, "");

  const wordmark = await textLayer({
    text: '<span foreground="#4D4738" font_size="140000">Solea</span>',
    fontfile: dmSerif,
    font: "DM Serif Display",
    width: 520,
    height: 170,
  });

  const tagline = await textLayer({
    text: '<span foreground="#6D705A" font_size="16000" letter_spacing="8000">— TASTE THE SUN —</span>',
    fontfile: inter500,
    font: "Inter Medium",
    width: 500,
    height: 50,
  });

  await sharp(Buffer.from(baseSvg))
    .composite([
      { input: wordmark, left: 340, top: 258 },
      { input: tagline, left: 350, top: 418 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(`${assetDir}/og-image.png`);
}

await mkdir(assetDir, { recursive: true });

const faviconSvg = `${assetDir}/favicon.svg`;
await sharp(faviconSvg).resize(32, 32).png().toFile(`${assetDir}/favicon-32.png`);
await sharp(faviconSvg).resize(192, 192).png().toFile(`${assetDir}/favicon-192.png`);
await sharp(faviconSvg).resize(180, 180).png().toFile(`${assetDir}/apple-touch-icon.png`);

const icoImages = await Promise.all([16, 32, 48].map(async size => ({
  size,
  buffer: await pngFromSvg(faviconSvg, size),
})));
await writeFile(`${assetDir}/favicon.ico`, createIco(icoImages));
await copyFile(`${assetDir}/favicon.ico`, "favicon.ico");

await makeOgImage();

console.log(`Generated Solea assets on ${PORCELAIN}.`);
