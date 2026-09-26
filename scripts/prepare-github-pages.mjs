#!/usr/bin/env node
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const indexFile = path.join(clientDir, "index.html");

if (!existsSync(indexFile)) {
  throw new Error("Missing GitHub Pages build input: dist/client/index.html");
}

const repository = process.env.GITHUB_REPOSITORY?.split("/").pop() || "magic-party-miniapp-v2";
const basePath = `/${repository}`;
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".svg", ".txt"]);
let updatedFiles = 0;

function rewriteAssetPaths(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      rewriteAssetPaths(file);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    const source = readFileSync(file, "utf8");
    const updated = source
      .replaceAll("/assets/", `${basePath}/assets/`)
      .replaceAll('href="/favicon.svg"', `href="${basePath}/favicon.svg"`);

    if (updated !== source) {
      writeFileSync(file, updated);
      updatedFiles += 1;
    }
  }
}

rewriteAssetPaths(clientDir);
copyFileSync(indexFile, path.join(clientDir, "404.html"));
writeFileSync(path.join(clientDir, ".nojekyll"), "");

console.log(`Prepared GitHub Pages build at ${basePath}/ (${updatedFiles} files updated)`);
