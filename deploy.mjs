// Windows/Mac/Linux deploy (same as deploy.sh, no bash or Python needed).
// Run from this folder:  node deploy.mjs          (live)
//                        node deploy.mjs preview  (test link first)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
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

const cfg = readFileSync(join(root, "pages/wrangler.jsonc"), "utf8");
const name = (cfg.match(/"name"\s*:\s*"([^"]+)"/) || [])[1];
if (!name || name === "YOUR-PROJECT-NAME") {
  console.error('Set your project name in pages/wrangler.jsonc ("name") first.');
  process.exit(1);
}
const branch = process.argv[2] === "preview" ? "preview" : "main";
execSync(`npx wrangler pages deploy dist --project-name ${name} --branch ${branch}`, {
  cwd: join(root, "pages"),
  stdio: "inherit",
});
