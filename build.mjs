// Builds pages/dist/_worker.js (page.html inlined into the worker).
// Cloudflare Pages runs this automatically on every GitHub push:
//   Build command: node build.mjs    Build output directory: pages/dist
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const B = String(Math.floor(Date.now() / 1000));
const html = readFileSync(join(root, "src/page.html"), "utf8");
const js = readFileSync(join(root, "src/index.js"), "utf8")
  .replace("import HTML from './page.html';", () => "const HTML = " + JSON.stringify(html) + ";")
  .split("__BUILD__").join(B);
mkdirSync(join(root, "pages/dist"), { recursive: true });
writeFileSync(join(root, "pages/dist/_worker.js"), js);
console.log("Built pages/dist/_worker.js (build " + B + ")");
