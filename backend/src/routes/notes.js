import { Router } from 'express';
import { Task } from '../models/Task.js';
import { computeQuadrant } from '../utils/quadrant.js';

const router = Router();

// list met filters: ?quadrant=II&habit=3&status=todo
router.get('/', async (req, res) => {
  const where = {};
  ['quadrant','habit','status'].forEach(k => { if (req.query[k]) where[k] = req.query[k]; });
  const tasks = await Task.findAll({ where, order: [['updated_at','DESC']] });
  res.json(tasks);
});

// create
router.post('/', async (req, res) => {
  const body = req.body || {};
  const quadrant = computeQuadrant(body);
  const task = await Task.create({ ...body, quadrant });
  res.status(201).json(task);
});

// update (recompute quadrant als velden wijzigen)
router.patch('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });

  const next = { ...task.toJSON(), ...req.body };
  next.quadrant = computeQuadrant(next);

  await task.update(next);
  res.json(task);
});

// done/undone
router.post('/:id/complete', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  const done = !!req.body.done;
  await task.update({ status: done ? 'done' : 'todo', completedAt: done ? new Date() : null });
  res.json(task);
});

// delete
router.delete('/:id', async (req, res) => {
  const n = await Task.destroy({ where: { id: req.params.id }});
  res.json({ deleted: n > 0 });
});

export default router;
