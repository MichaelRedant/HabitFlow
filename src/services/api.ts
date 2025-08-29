import type { Note, NoteBase, Task, TaskBase } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// NOTES
export async function fetchNotes(): Promise<Note[]> {
  const r = await fetch(`${BASE}/api/notes`);
  return r.json();
}
export async function createNote(input: NoteBase): Promise<Note> {
  const r = await fetch(`${BASE}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return r.json();
}
export async function updateNote(id: number, patch: Partial<NoteBase>): Promise<Note> {
  const r = await fetch(`${BASE}/api/notes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  return r.json();
}
export async function deleteNote(id: number): Promise<{ deleted: boolean }> {
  const r = await fetch(`${BASE}/api/notes/${id}`, { method: 'DELETE' });
  return r.json();
}

// TASKS
export async function fetchTasks(params: Record<string, string> = {}): Promise<Task[]> {
  const qs = new URLSearchParams(params).toString();
  const r = await fetch(`${BASE}/api/tasks${qs ? `?${qs}` : ''}`);
  return r.json();
}
export async function createTask(input: Partial<TaskBase>): Promise<Task> {
  const r = await fetch(`${BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return r.json();
}
export async function updateTask(id: number, patch: Partial<TaskBase>): Promise<Task> {
  const r = await fetch(`${BASE}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  return r.json();
}
export async function completeTask(id: number, done = true): Promise<Task> {
  const r = await fetch(`${BASE}/api/tasks/${id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done }),
  });
  return r.json();
}
