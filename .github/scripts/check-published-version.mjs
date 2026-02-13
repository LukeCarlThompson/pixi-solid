import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Determine the package.json path based on the working directory
const packageJsonPath = path.join(process.cwd(), "packages", "pixi-solid", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const pkg_name = packageJson.name;
const pkg_version = packageJson.version;

let published = false;
try {
  // Use npm view to check if the package version exists
  // stdio: 'ignore' prevents npm from printing to stdout/stderr
  execSync(`npm view "${pkg_name}@${pkg_version}" --registry=https://registry.npmjs.org/`, {
    stdio: "ignore",
  });
  published = true;
} catch {
  // If npm view fails (e.g., package not found or version not found), it throws an error
  published = false;
}

// Set outputs for GitHub Actions
// For GitHub Actions, outputs are written to a file specified by GITHUB_OUTPUT environment variable
const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  fs.appendFileSync(githubOutput, `name=${pkg_name}\n`);
  fs.appendFileSync(githubOutput, `version=${pkg_version}\n`);
  fs.appendFileSync(githubOutput, `published=${published}\n`);
} else {
  // Fallback for local testing or older environments
  console.log(
    `::warning::GITHUB_OUTPUT environment variable not found. Outputs will be printed to console.`,
  );
  console.log(`name=${pkg_name}`);
  console.log(`version=${pkg_version}`);
  console.log(`published=${published}`);
}

// Add the warning logic here
if (published) {
  console.log(
    `::warning::Package ${pkg_name}@${pkg_version} is already published to npm. Publish will be skipped.`,
  );
}

console.log(`Checked package: ${pkg_name}@${pkg_version}, Published: ${published}`);
