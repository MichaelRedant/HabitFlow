import { Router } from "express";
import { analyzeNote, classifyText } from "../ai.js";
import { Note } from "../models/Note.js";
import { searchNotes } from "../embeddings.js";

const router = Router();

// POST /api/ai/summarize  { noteId }
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

export default router;
