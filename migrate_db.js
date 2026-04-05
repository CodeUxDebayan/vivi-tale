const fs = require("fs");
const path = require("path");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const dataPath = path.join(__dirname, "data.json");

if (!fs.existsSync(dataPath)) {
  console.log("No data store found. Nothing to migrate.");
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
let touched = 0;

data.projects = (data.projects || []).map((project) => {
  const next = { ...project };
  if (!next.slug && next.title) {
    next.slug = slugify(next.title);
    touched += 1;
  }
  if (!next.artistSlug && next.artist) {
    next.artistSlug = slugify(next.artist);
    touched += 1;
  }
  return next;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Migration complete. Updated ${touched} field(s).`);
