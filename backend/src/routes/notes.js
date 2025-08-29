import { Router } from 'express';
import { Note } from '../models/Note.js';

const router = Router();

// list notes with optional filters: ?habit=3&quadrant=II
router.get('/', async (req, res) => {
  const where = {};
  ['habit', 'quadrant'].forEach(k => { if (req.query[k]) where[k] = req.query[k]; });
  const notes = await Note.findAll({ where, order: [['updated_at','DESC']] });
  res.json(notes);
});

// create note
router.post('/', async (req, res) => {
  const body = req.body || {};
  const note = await Note.create(body);
  res.status(201).json(note);
});

// update note
router.patch('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (!note) return res.status(404).json({ error: 'Not found' });
  await note.update(req.body || {});
  res.json(note);
});

// delete note
router.delete('/:id', async (req, res) => {
  const n = await Note.destroy({ where: { id: req.params.id } });
  res.json({ deleted: n > 0 });
});

export default router;
