import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const sourcePath = resolve(rootDir, "packages/pixi-solid/README.md");
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
  if (currentTargetContent === generatedContent) {
    console.log("README is in sync.");
    process.exit(0);
  }

  console.error("README is out of sync. Run: pnpm readme:sync");
  process.exit(1);
}

await writeFile(targetPath, generatedContent, "utf8");
console.log("Synced README.md from packages/pixi-solid/README.md");
