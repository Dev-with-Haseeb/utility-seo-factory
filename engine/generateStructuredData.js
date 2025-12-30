// engine/generateStructuredData.js

function generateStructuredData(schema, siteConfig) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": schema.tool_name,
    "applicationCategory": schema.structured_data.applicationCategory,
    "operatingSystem": "All",
    "description": schema.tool_purpose,
    "url": `${siteConfig.baseUrl}/${schema.slug}/`,
    "featureList": [
      ...schema.inputs.map(
        (input) =>
          `Input: ${input.label}${input.unit ? " (" + input.unit + ")" : ""}`
      ),
      ...schema.outputs.map(
        (output) =>
          `Output: ${output.label}${output.unit ? " (" + output.unit + ")" : ""}`
      )
    ]
  };

  return `
<script type="application/ld+json">
${JSON.stringify(data, null, 2)}
</script>
`;
}

module.exports = generateStructuredData;
