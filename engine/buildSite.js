// engine/buildSite.js

const fs = require("fs");
const path = require("path");

const validateSchema = require("./validateSchema");
const normalizeSchema = require("./normalizeSchema");
const renderTool = require("./renderTool");
const generateStructuredData = require("./generateStructuredData");
const generatePage = require("./generatePage");
const generateIndex = require("./generateIndex");

const siteConfig = require("../config/site.config.json");

const SCHEMA_DIR = path.join(__dirname, "../schemas");
const DIST_DIR = path.join(__dirname, "../dist");

function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_DIR);
}

function loadSchemas() {
    return fs
        .readdirSync(SCHEMA_DIR)
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
            const fullPath = path.join(SCHEMA_DIR, file);
            const raw = fs.readFileSync(fullPath, "utf8");
            return JSON.parse(raw);
        });
}

function writeFile(relativePath, content) {
    const fullPath = path.join(DIST_DIR, relativePath);
    const dir = path.dirname(fullPath);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
}

function copyPublicAssets() {
    const publicDir = path.join(__dirname, "../public");
    if (!fs.existsSync(publicDir)) return;

    fs.cpSync(publicDir, DIST_DIR, { recursive: true });
}


function build() {
    console.log("Starting build...");

    cleanDist();
    copyPublicAssets();


    const rawSchemas = loadSchemas();
    const normalizedTools = [];

    rawSchemas.forEach((schema) => {
        validateSchema(schema);
        const normalized = normalizeSchema(schema);

        const toolHtml = renderTool(normalized);
        const structuredData = generateStructuredData(normalized, siteConfig);
        const pageHtml = generatePage({
            schema: normalized,
            toolHtml,
            structuredData
        });

        writeFile(`${normalized.slug}/index.html`, pageHtml);
        normalizedTools.push(normalized);
    });

    const indexHtml = generateIndex({
        tools: normalizedTools,
        siteConfig
    });

    writeFile("index.html", indexHtml);

    console.log("Build complete.");
}

build();
