const fs = require("fs");
const path = require("path");
const matter = require(path.join(process.cwd(), "node_modules/gray-matter"));
function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(f);
    else if (e.name.endsWith(".mdx")) yield f;
  }
}
for (const f of walk(path.join(process.cwd(), "content/kb"))) {
  try {
    const raw = fs.readFileSync(f, "utf8");
    matter(raw);
  } catch (e) {
    console.log("BAD:", f.replace(process.cwd(), "."));
    console.log("   ", e.message);
  }
}
console.log("done");