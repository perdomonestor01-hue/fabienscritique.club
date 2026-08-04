// Wraps the Artifact body-only source into a standalone HTML document
// (forced light theme for print) so headless Chrome can render a clean PDF.
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const src = fs.readFileSync(path.join(dir, "cws-value-assessment.html"), "utf8");

const wrapped = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1120, initial-scale=1">
<meta name="color-scheme" content="light">
</head>
<body>
${src}
</body>
</html>`;

fs.writeFileSync(path.join(dir, "cws-value-assessment.print.html"), wrapped);
console.log("wrote cws-value-assessment.print.html");
