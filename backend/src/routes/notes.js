import { Router } from 'express';
import { Note } from '../models/Note.js';

const router = Router();

router.get('/', async (_req, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

router.post('/', async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
});

export default router;
