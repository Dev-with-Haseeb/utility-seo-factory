// engine/validateSchema.js

const ALLOWED_INTENTS = [
  "calculate",
  "convert",
  "estimate",
  "validate",
  "check",
  "compare"
];

const ALLOWED_INPUT_TYPES = ["number", "select", "boolean"];

function fail(message) {
  throw new Error(`Schema validation failed: ${message}`);
}

function validateSchema(schema) {
  if (!schema || typeof schema !== "object") {
    fail("Schema must be an object.");
  }

  // ---- Core identifiers ----
  if (!schema.tool_id || typeof schema.tool_id !== "string") {
    fail("tool_id is required and must be a string.");
  }

  if (!schema.tool_category || typeof schema.tool_category !== "string") {
    fail("tool_category is required and must be a string.");
  }

  if (!ALLOWED_INTENTS.includes(schema.intent_type)) {
    fail(`intent_type must be one of: ${ALLOWED_INTENTS.join(", ")}`);
  }

  // ---- Tool definition ----
  if (!schema.tool_name || typeof schema.tool_name !== "string") {
    fail("tool_name is required and must be a string.");
  }

  if (!schema.tool_purpose || typeof schema.tool_purpose !== "string") {
    fail("tool_purpose is required and must be a string.");
  }

  // ---- Inputs ----
  if (!Array.isArray(schema.inputs) || schema.inputs.length === 0) {
    fail("At least one input is required.");
  }

  schema.inputs.forEach((input, index) => {
    if (!input.input_id || typeof input.input_id !== "string") {
      fail(`Input[${index}]: input_id is required and must be a string.`);
    }

    if (!input.label || typeof input.label !== "string") {
      fail(`Input[${index}]: label is required and must be a string.`);
    }

    if (!ALLOWED_INPUT_TYPES.includes(input.type)) {
      fail(
        `Input[${index}]: type must be one of: ${ALLOWED_INPUT_TYPES.join(", ")}`
      );
    }

    if (!("default_value" in input)) {
      fail(`Input[${index}]: default_value is required.`);
    }

    if (!input.constraints || typeof input.constraints !== "object") {
      fail(`Input[${index}]: constraints object is required.`);
    }

    if (input.constraints.required !== true) {
      fail(`Input[${index}]: constraints.required must be true.`);
    }

    if (!input.explanation || typeof input.explanation !== "string") {
      fail(`Input[${index}]: explanation is required and must be a string.`);
    }
  });

  // ---- Calculation logic ----
  if (!schema.calculation_logic || typeof schema.calculation_logic !== "object") {
    fail("calculation_logic is required.");
  }

  if (
    !schema.calculation_logic.formula ||
    typeof schema.calculation_logic.formula !== "string"
  ) {
    fail("calculation_logic.formula is required and must be a string.");
  }

  if (
    !schema.calculation_logic.variables ||
    typeof schema.calculation_logic.variables !== "object"
  ) {
    fail("calculation_logic.variables is required and must be an object.");
  }

  // ---- Outputs ----
  if (!Array.isArray(schema.outputs) || schema.outputs.length === 0) {
    fail("At least one output is required.");
  }

  schema.outputs.forEach((output, index) => {
    if (!output.output_id || typeof output.output_id !== "string") {
      fail(`Output[${index}]: output_id is required and must be a string.`);
    }

    if (!output.label || typeof output.label !== "string") {
      fail(`Output[${index}]: label is required and must be a string.`);
    }

    if (!output.description || typeof output.description !== "string") {
      fail(`Output[${index}]: description is required and must be a string.`);
    }
  });

  // ---- Assumptions ----
  if (!Array.isArray(schema.assumptions)) {
    fail("assumptions must be an array.");
  }

  // ---- SEO ----
  if (!schema.seo || typeof schema.seo !== "object") {
    fail("seo object is required.");
  }

  if (!schema.seo.title_template || typeof schema.seo.title_template !== "string") {
    fail("seo.title_template is required and must be a string.");
  }

  if (!schema.seo.meta_description || typeof schema.seo.meta_description !== "string") {
    fail("seo.meta_description is required and must be a string.");
  }

  // ---- Structured data ----
  if (!schema.structured_data || typeof schema.structured_data !== "object") {
    fail("structured_data object is required.");
  }

  // ---- Indexing ----
  if (
    !schema.indexing ||
    schema.indexing.indexable !== true
  ) {
    fail("Only tool pages may be indexable. indexing.indexable must be true.");
  }

  // ---- Monetization ----
  if (
    schema.monetization &&
    schema.monetization.ads_enabled === true
  ) {
    fail("ads_enabled must be false in v1.");
  }

  return true;
}

module.exports = validateSchema;
