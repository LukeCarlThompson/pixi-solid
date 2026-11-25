import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Builds the publish matrix from the workspace, so no package list is maintained by hand.
 *
 * A package is included when its current version is not on npm. Private packages, such as the docs
 * site, are skipped. Writes `matrix`, a JSON array of `{ package, version }`, to GITHUB_OUTPUT, and
 * a table to the job summary.
 */
const PACKAGES_DIR = "packages";
const REGISTRY = "https://registry.npmjs.org/";

const isPublished = (name, version) => {
  try {
    execSync(`npm view "${name}@${version}" --registry=${REGISTRY}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const readPackages = () => {
  const packages = [];

  for (const dir of fs.readdirSync(PACKAGES_DIR)) {
    const manifestPath = path.join(PACKAGES_DIR, dir, "package.json");
    if (!fs.existsSync(manifestPath)) continue;

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (manifest.private || !manifest.name || !manifest.version) continue;

    packages.push({ dir, name: manifest.name, version: manifest.version });
  }

  return packages.sort((a, b) => a.name.localeCompare(b.name));
};

const unpublished = [];
const rows = [];

for (const pkg of readPackages()) {
  const published = isPublished(pkg.name, pkg.version);

  if (!published) unpublished.push({ package: pkg.dir, version: pkg.version });

  rows.push(`| ${pkg.name} | ${pkg.version} | ${published ? "already on npm" : "will publish"} |`);
  console.log(`${pkg.name}@${pkg.version}: ${published ? "already published" : "will publish"}`);
}

const matrix = JSON.stringify(unpublished);
const githubOutput = process.env.GITHUB_OUTPUT;

if (githubOutput) fs.appendFileSync(githubOutput, `matrix=${matrix}\n`);
else console.log(`matrix=${matrix}`);

const summary = [
  "### Publish preflight",
  "",
  "| Package | Version | State |",
  "| --- | --- | --- |",
  ...rows,
  "",
  unpublished.length === 0
    ? "Nothing to publish: every version on this branch is already on npm."
    : `${unpublished.length} package(s) to publish.`,
].join("\n");

const stepSummary = process.env.GITHUB_STEP_SUMMARY;

if (stepSummary) fs.appendFileSync(stepSummary, `${summary}\n`);
else console.log(summary);
