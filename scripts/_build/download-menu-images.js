import fs from "node:fs/promises";
import path from "node:path";

const dataPath = "data/menu.json";
const outDir = "public/assets/menu";
const retries = 3;

function toHighResUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.search = "";
  url.searchParams.set("w", "2000");
  url.searchParams.set("q", "90");
  url.searchParams.set("fm", "jpg");
  return url.toString();
}

async function fetchWithRetry(url, attempt = 1) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    if (attempt >= retries) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    return fetchWithRetry(url, attempt + 1);
  }
}

const menu = JSON.parse(await fs.readFile(dataPath, "utf8"));
const items = menu.categories.flatMap((category) => category.items);

await fs.mkdir(outDir, { recursive: true });

let succeeded = 0;
let failed = 0;

for (const item of items) {
  const targetUrl = toHighResUrl(item.image);
  const outputPath = path.join(outDir, `${item.id}.jpg`);

  try {
    const response = await fetchWithRetry(targetUrl);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(outputPath, buffer);
    succeeded += 1;
    console.log(`saved ${item.id}.jpg`);
  } catch (error) {
    failed += 1;
    console.error(`failed ${item.id}: ${error.message}`);
  }
}

console.log(`summary: ${succeeded} succeeded, ${failed} failed`);

