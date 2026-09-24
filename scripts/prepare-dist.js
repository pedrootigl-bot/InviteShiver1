const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");

if (!fs.existsSync(outDir)) {
  console.error("Pasta out/ não encontrada. Rode next build antes.");
  process.exit(1);
}

/**
 * HTML/JS: caminhos absolutos -> relativos à página.
 * CSS: fontes ficam em _next/static/media; o CSS está em _next/static/css,
 * então o relativo correto é ../media/ (não ./_next/...).
 */
function rewriteHtmlOrJs(content) {
  return content
    .replace(/(["'`(=])\/(_next\/)/g, "$1./$2")
    .replace(/(["'`(=])\/(media\/)/g, "$1./$2")
    .replace(/(["'`(=])\/(brand\/)/g, "$1./$2")
    .replace(/(["'`(=])\/(icon\.png)/g, "$1./$2")
    .replace(/(["'`(=])\/(404\/?)/g, "$1./$2")
    .replace(/href="\/"/g, 'href="./"')
    .replace(/href='\/'/g, "href='./'");
}

function rewriteCss(content) {
  return content
    .replace(/url\(\/_next\/static\/media\//g, "url(../media/")
    .replace(/url\(\.\/_next\/static\/media\//g, "url(../media/");
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (![".html", ".js", ".css", ".json", ".txt"].includes(ext)) continue;

    const before = fs.readFileSync(full, "utf8");
    const after =
      ext === ".css" ? rewriteCss(before) : rewriteHtmlOrJs(before);

    if (after !== before) fs.writeFileSync(full, after, "utf8");
  }
}

walk(outDir);

fs.rmSync(distDir, { recursive: true, force: true });
fs.cpSync(outDir, distDir, { recursive: true });

console.log(
  "dist/ pronto com caminhos relativos para upload na Hostinger (public_html).",
);
