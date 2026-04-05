const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data.json");

if (!fs.existsSync(dataPath)) {
  console.log(
    "No data store found. Create one by running the app or `node seed.js`.",
  );
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

console.log("--- Projects Count ---");
console.log((data.projects || []).length);
console.log("--- Artists Count ---");
console.log((data.artists || []).length);

console.log("--- Project Fields ---");
console.log(Object.keys((data.projects || [])[0] || {}));

console.log("--- Artist Fields ---");
console.log(Object.keys((data.artists || [])[0] || {}));
