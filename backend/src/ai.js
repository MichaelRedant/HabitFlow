// backend/src/ai.js
import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Compacte helper om structured JSON terug te krijgen
async function respondJSON({ model, system, user, schema }) {
  const res = await openai.responses.create({
    model, // bijv. "gpt-4.1-mini" (snel/goedkoop) of zwaarder indien nodig
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "Result", schema, strict: true },
    },
  });
  // Responses API geeft makkelijk de tekst eruit
  const text = res.output_text || "{}";
  return JSON.parse(text);
}

// 1) Notitie -> samenvatting + acties + classificatie
export async function analyzeNote({ title, content }) {
  const system =
    "Je bent een productieve notuleer-assistent die werkt volgens Covey's 7 Habits en de Eisenhower-matrix. Geef beknopt en concreet terug.";
  const user = `
Titel: ${title}
Inhoud:
${content}
  `;

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string" },
      suggestedTags: { type: "array", items: { type: "string" } },
      habit: { type: ["integer", "null"], minimum: 1, maximum: 7 },
      quadrant: { type: ["string", "null"], enum: ["I", "II", "III", "IV"] },
      actionItems: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["title", "quadrant"],
          properties: {
            title: { type: "string" },
            owner: { type: ["string", "null"] },
            due: {
              type: ["string", "null"],
              description: "ISO-8601 datum of null",
            },
            quadrant: { type: "string", enum: ["I", "II", "III", "IV"] },
            habit: { type: ["integer", "null"], minimum: 1, maximum: 7 },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    required: ["summary", "actionItems"],
  };

  return respondJSON({
    model: "gpt-4.1-mini",
    system,
    user,
    schema,
  });
}

// 2) Tekst -> habit/quadrant/tags (losse classifier, handig voor snelle taken)
export async function classifyText(text) {
  const system =
    "Classificeer korte tekst in Covey habit (1-7), Eisenhower quadrant (I-IV) en stel tags voor.";
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      habit: { type: ["integer", "null"], minimum: 1, maximum: 7 },
      quadrant: { type: ["string", "null"], enum: ["I", "II", "III", "IV"] },
      suggestedTags: { type: "array", items: { type: "string" } },
    },
    required: ["habit", "quadrant"],
  };

  return respondJSON({
    model: "gpt-4.1-mini",
    system,
    user: text,
    schema,
  });
}
