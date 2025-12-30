// engine/generateIndex.js

const fs = require("fs");
const path = require("path");

function generateIndex({ tools, siteConfig }) {
    const templatePath = path.join(__dirname, "../templates/tool.html");
    const template = fs.readFileSync(templatePath, "utf8");

    const links = tools
        .map(
            (tool) =>
                `<li><a href="./${tool.slug}/index.html">${tool.tool_name}</a></li>`
        )
        .join("");

    let html = template;
    html = html.replaceAll("{{TITLE}}", siteConfig.siteName);
    html = html.replace("{{TOOL_LINKS}}", links);

    return html;
}

module.exports = generateIndex;
