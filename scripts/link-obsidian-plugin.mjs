import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { resolveOpenVaultPath } from "./obsidian-vault-utils.mjs";

const repoRoot = process.cwd();
const vaultPath = resolveOpenVaultPath();
const sourceDir = path.join(repoRoot, "apps", "obsidian-plugin");
const targetDir = path.join(vaultPath, ".obsidian", "plugins", "openagent");
const linkedFiles = ["main.js", "manifest.json", "styles.css", "package.json", "logo.png"];

fs.mkdirSync(targetDir, { recursive: true });

for (const fileName of linkedFiles) {
  const sourcePath = path.join(sourceDir, fileName);
  const targetPath = path.join(targetDir, fileName);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source plugin file: ${sourcePath}`);
  }

  removeExistingTarget(targetPath);
  linkOrCopy(sourcePath, targetPath);
}

const hotReloadMarkerPath = path.join(targetDir, ".hotreload");
if (!fs.existsSync(hotReloadMarkerPath)) {
  fs.writeFileSync(hotReloadMarkerPath, "", "utf8");
}

console.log(`Linked Obsidian plugin files from ${sourceDir} to ${targetDir}`);

function linkOrCopy(sourcePath, targetPath) {
  // On Windows, creating symlinks without Developer Mode or elevated privileges
  // will throw EPERM. Fall back to copying the file in that case.
  try {
    fs.symlinkSync(sourcePath, targetPath);
  } catch (error) {
    if (process.platform === "win32" && (error.code === "EPERM" || error.code === "EACCES")) {
      fs.copyFileSync(sourcePath, targetPath);
    } else {
      throw error;
    }
  }
}

function removeExistingTarget(targetPath) {
  const stat = fs.lstatSync(targetPath, { throwIfNoEntry: false });
  if (!stat) {
    return;
  }

  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    throw new Error(`Refusing to replace directory with symlink: ${targetPath}`);
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
}
