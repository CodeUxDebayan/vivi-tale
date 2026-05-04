const fs = require("fs");
const path = require("path");

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) {
      files.push(full);
    }
  }
  return files;
}

function findMissingProps(file) {
  const src = fs.readFileSync(file, "utf8");
  const results = [];
  const regex = /<Image\b([\s\S]*?)\/?>/g;
  let match;
  while ((match = regex.exec(src)) !== null) {
    const tag = match[0];
    const start = src.substring(0, match.index).split("\n").length;
    const hasWidth = /\bwidth\s*=/.test(tag);
    const hasHeight = /\bheight\s*=/.test(tag);
    const hasFill = /\bfill\b/.test(tag);
    if (!(hasWidth || hasHeight || hasFill)) {
      results.push({ line: start, tag: tag.trim() });
    }
  }
  return results;
}

const root = path.join(process.cwd(), "src");
const files = walk(root);
let any = false;
for (const f of files) {
  const misses = findMissingProps(f);
  if (misses.length) {
    any = true;
    console.log(`\n${f}`);
    for (const m of misses) {
      console.log(
        `  line ${m.line}: ${m.tag.split("\n").slice(0, 2).join(" ")}...`,
      );
    }
  }
}
if (!any) console.log("No Image tags missing width/height/fill found.");
