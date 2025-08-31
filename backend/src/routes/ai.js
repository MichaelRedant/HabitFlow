import { Router } from "express";
import { analyzeNote, classifyText, parseTask, weeklyCompass } from "../ai.js";
import { Note } from "../models/Note.js";
import { searchNotes } from "../embeddings.js";
import { Op } from "sequelize";

const router = Router();

// POST /api/ai/summarizes  { noteId }
router.post("/summarize", async (req, res) => {
  const { noteId } = req.body;
  const note = await Note.findByPk(noteId);
  if (!note) return res.status(404).json({ error: "Notitie niet gevonden" });

  const data = await analyzeNote({ title: note.title, content: note.content || "" });
  res.json(data);
});

// POST /api/ai/classify  { text }
router.post("/classify", async (req, res) => {
  const { text } = req.body;
  const data = await classifyText(text);
  res.json(data);
});

router.get("/search", async (req, res) => {
  const q = String(req.query.q || "");
  const results = await searchNotes(q, 10);
  res.json(results);
});

// POST /api/ai/matrix { text }
router.post("/matrix", async (req, res) => {
  const { text } = req.body;
  const data = await parseTask(text);
  res.json(data);
});

// POST /api/ai/weekly -> gebruikt notities van afgelopen week
router.post("/weekly", async (_req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const notes = await Note.findAll({
    where: { updatedAt: { [Op.gte]: since } },
  });
  const text = notes
    .map((n) => `# ${n.title}\n${n.content || ""}`)
    .join("\n\n");
  const data = await weeklyCompass(text);
  res.json(data);
});

export default router;
