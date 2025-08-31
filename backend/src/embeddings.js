import { openai } from "./ai.js";
import { sequelize } from "./db.js";
import { QueryTypes } from "sequelize";

export async function embedText(texts) {
  const r = await openai.embeddings.create({
    model: "text-embedding-3-small", // goedkoop en prima voor search
    input: texts,
  });
  return r.data.map((x) => x.embedding);
}

export async function upsertNoteEmbedding(noteId, text) {
  const [vec] = await embedText([text]);
  const payload = JSON.stringify(vec);
  await sequelize.query(
    `
    INSERT INTO note_embeddings (note_id, vector, updated_at)
    VALUES (?, ?, NOW())
    ON DUPLICATE KEY UPDATE vector = VALUES(vector), updated_at = VALUES(updated_at)
    `,
    { replacements: [noteId, payload], type: QueryTypes.INSERT }
  );
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Query top-K in geheugen (voor kleine datasets prima)
export async function searchNotes(query, k = 10) {
  const [qVec] = await embedText([query]);
  const rows = await sequelize.query(
    `SELECT n.id, n.title, n.content, e.vector
     FROM notes n
     JOIN note_embeddings e ON e.note_id = n.id`,
    { type: QueryTypes.SELECT }
  );
  const ranked = rows.map(r => {
    const vec = JSON.parse(r.vector);
    return { id: r.id, title: r.title, score: cosine(qVec, vec) };
  }).sort((a,b) => b.score - a.score).slice(0, k);
  return ranked;
}
