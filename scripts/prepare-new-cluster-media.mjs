import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const inputs = process.argv.slice(2);
if (inputs.length !== 3)
  throw new Error(
    "Supply the three original artwork paths: MONOPOLY GO, VALORANT, Coin Master.",
  );
for (const [i, slug] of ["monopoly-go", "valorant", "coin-master"].entries()) {
  const dir = resolve("public/images/games", slug);
  await mkdir(dir, { recursive: true });
  await sharp(inputs[i])
    .resize(1200, 675, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(resolve(dir, "scene.webp"));
  await sharp(inputs[i])
    .resize(256, 256, { fit: "cover" })
    .webp({ quality: 85 })
    .toFile(resolve(dir, "icon.webp"));
  console.log(`Created original ${slug} scene and icon.`);
}
