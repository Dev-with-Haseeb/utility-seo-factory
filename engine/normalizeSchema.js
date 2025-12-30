// engine/normalizeSchema.js

function normalizeSchema(schema) {
    // Shallow clone to avoid mutation
    const normalized = JSON.parse(JSON.stringify(schema));

    // ---- Normalize inputs ----
    normalized.inputs = normalized.inputs.map((input) => {
        return {
            id: input.input_id,
            label: input.label,
            type: input.type,
            unit: input.unit || null,
            defaultValue: input.default_value,
            constraints: input.constraints,
            explanation: input.explanation,
            options: input.options || null
        };
    });


    // ---- Normalize outputs ----
    normalized.outputs = normalized.outputs.map((output) => {
        return {
            id: output.output_id,
            label: output.label,
            unit: output.unit || null,
            description: output.description
        };
    });

    // ---- Normalize calculation logic ----
    normalized.calculation = {
        variables: normalized.calculation_logic.variables,
        formula: normalized.calculation_logic.formula,
        rounding: normalized.calculation_logic.rounding || null
    };

    delete normalized.calculation_logic;

    // ---- Normalize SEO ----
    normalized.seo = {
        title: normalized.seo.title_template,
        description: normalized.seo.meta_description
    };

    // ---- Attach helpers ----
    normalized.slug = normalized.tool_id;
    normalized.category = normalized.tool_category;
    normalized.intent = normalized.intent_type;

    // ---- Normalize tool notes (SEO-safe text) ----
    normalized.toolNotes = Array.isArray(normalized.tool_notes)
        ? normalized.tool_notes.map((n) => ({
            title: n.title,
            text: n.text
        }))
        : [];


    return normalized;
}

module.exports = normalizeSchema;
