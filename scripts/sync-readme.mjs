import { readFile, writeFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const sourceDir = resolve(rootDir, "packages/pixi-solid");
const sourcePath = resolve(sourceDir, "README.md");
const targetPath = resolve(rootDir, "README.md");
const isCheck = process.argv.includes("--check");

const sourceContent = await readFile(sourcePath, "utf8");

// Extract and replace image paths - handle both markdown ![](path) and HTML <img src="path" />
const markdownImageRegex = /!\[.*?\]\((\.\/[^)]+)\)/g;
const htmlImageRegex = /src="(\.\/[^"]+)"/g;

// Collect all image paths for verification
const markdownImages = Array.from(sourceContent.matchAll(markdownImageRegex)).map(
  (match) => match[1],
);
const htmlImages = Array.from(sourceContent.matchAll(htmlImageRegex)).map((match) => match[1]);
const images = [...markdownImages, ...htmlImages];

// Replace relative image and LICENSE paths to point to packages/pixi-solid
const updatedContent = sourceContent
  .replace(markdownImageRegex, (match) => {
    const imagePath = match.match(/\((\.\/[^)]+)\)/)[1];
    return match.replace(imagePath, `packages/pixi-solid/${imagePath.substring(2)}`);
  })
  .replace(htmlImageRegex, (match) => {
    const imagePath = match.match(/src="(\.\/[^"]+)"/)[1];
    return match.replace(imagePath, `packages/pixi-solid/${imagePath.substring(2)}`);
  })
  .replace(/\]\(\.\/(LICENSE)\)/g, "](packages/pixi-solid/$1)");

const generatedContent = [
  "<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->",
  "<!-- Source: packages/pixi-solid/README.md -->",
  "",
  updatedContent,
].join("\n");

let currentTargetContent = "";
try {
  currentTargetContent = await readFile(targetPath, "utf8");
} catch {
  currentTargetContent = "";
}

if (isCheck) {
  let hasErrors = false;

  if (currentTargetContent !== generatedContent) {
    console.error("README is out of sync. Run: pnpm readme:sync");
    hasErrors = true;
  }

  // Verify all linked images exist in source
  for (const imagePath of images) {
    const sourceImagePath = resolve(sourceDir, imagePath);
    try {
      await access(sourceImagePath);
    } catch {
      console.error(`Missing image: ${imagePath}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log("README is in sync.");
  process.exit(0);
}

await writeFile(targetPath, generatedContent, "utf8");
console.log("Synced README.md from packages/pixi-solid/README.md");
