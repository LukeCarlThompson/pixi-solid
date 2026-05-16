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

const generatedContent = [
  "<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. -->",
  "<!-- Source: packages/pixi-solid/README.md -->",
  "",
  sourceContent,
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
