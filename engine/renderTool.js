// engine/renderTool.js

function renderTool(schema) {
    const notesHtml =
        schema.toolNotes && schema.toolNotes.length
            ? `
      <section class="tool-notes">
        ${schema.toolNotes
                .map(
                    (n) => `
            <h2>${n.title}</h2>
            <p>${n.text}</p>
          `
                )
                .join("")}
      </section>
    `
            : "";


    const inputFields = schema.inputs
        .map((input) => {
            if (input.type === "select") {
                const options = input.options
                    .map(
                        (opt) =>
                            `<option value="${opt.value}" ${opt.value === input.defaultValue ? "selected" : ""
                            }>${opt.label}</option>`
                    )
                    .join("");

                return `
          <label>
            ${input.label}
            <select id="${input.id}">
              ${options}
            </select>
            <small>${input.explanation}</small>
          </label>
        `;
            }

            return `
        <label>
          <span>
            ${input.label}${input.unit ? ` (${input.unit})` : ""}
          </span>
          <input
            type="number"
            id="${input.id}"
            value="${input.defaultValue}"
            step="any"
          />
          <small>${input.explanation}</small>
        </label>

      `;
        })
        .join("");

    const outputFields = schema.outputs
        .map(
            (output) => `
        <div class="output">
          <strong>${output.label}:</strong>
          <span id="${output.id}">—</span>
          ${output.unit ? `<span>${output.unit}</span>` : ""}
          <small>${output.description}</small>
        </div>
      `
        )
        .join("");

    const script = `
        <script>
        (function () {
          function calculate() {
            ${schema.inputs
            .map(
                (input) => `
            const ${input.id} = document.getElementById("${input.id}").value;
            `
            )
            .join("")}
        
            ${Object.entries(schema.calculation.variables)
            .map(
                ([key, expr]) => `
            const ${key} = ${expr};
            `
            )
            .join("")}
        
            let result = ${schema.calculation.formula};
        
            ${schema.calculation.rounding
            ? `
            const factor = Math.pow(10, ${schema.calculation.rounding.decimals});
            result = Math.${schema.calculation.rounding.method}(result * factor) / factor;
            `
            : ""
        }

            ${schema.outputs
            .map((output, index) => {
                if (schema.outputs.length === 1) {
                    return `
            document.getElementById("${output.id}").textContent =
              Number.isFinite(result) ? result : "—";
            `;
                }

                if (output.unit === "cubic yards") {
                    return `
            document.getElementById("${output.id}").textContent =
              Number.isFinite(result) ? (result / 27).toFixed(2) : "—";
            `;
                }

                return `
            document.getElementById("${output.id}").textContent =
              Number.isFinite(result) ? result : "—";
            `;
            })
            .join("")}
          }

          ${schema.inputs
            .map(
                (input) => `
          document.getElementById("${input.id}").addEventListener("input", calculate);
          `
            )
            .join("")}
        
          calculate();
        })();
        </script>
        `;


    return `
    <div class="tool">
      <form class="inputs">
        ${inputFields}
      </form>

      <div class="outputs">
        ${outputFields}
      </div>

      ${notesHtml}

      ${script}
    </div>
  `;

}

module.exports = renderTool;
