// engine/generatePage.js

const fs = require("fs");
const path = require("path");

function generatePage({ schema, toolHtml, structuredData }) {
    const templatePath = path.join(__dirname, "../templates/page.html");
    const template = fs.readFileSync(templatePath, "utf8");

    let html = template;

    html = html.replaceAll("{{TITLE}}", schema.seo.title);
    html = html.replaceAll("{{DESCRIPTION}}", schema.seo.description);
    html = html.replace("{{STRUCTURED_DATA}}", structuredData);
    html = html.replace("{{TOOL}}", toolHtml);

    return html;
}

module.exports = generatePage;
