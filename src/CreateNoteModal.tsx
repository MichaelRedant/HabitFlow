
import { useEffect, useState } from 'react';

import { createNote, updateNote, createTask } from './services/api';
import { aiSummarize } from './services/ai';
import { QUADRANT_PRESET } from './constants';
import type { Note, HabitId, Quadrant } from './types';

export default function CreateNoteModal(

  { open, onClose, onCreated, initialDate }:
  { open: boolean; onClose: () => void; onCreated: (n: Note) => void; initialDate?: Date | null }
) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduled, setScheduled] = useState('');

  useEffect(() => {
    if (open) {
      setScheduled(initialDate ? initialDate.toISOString().slice(0, 16) : '');
    }
  }, [open, initialDate]);


  if (!open) return null;

  async function submit() {
    const input = {
      title: title.trim(),
      content: content.trim() || undefined,
      tags: [] as string[],

      scheduledAt: scheduled ? new Date(scheduled).toISOString() : null,

    };
    const created = await createNote(input);
    try {
      const ai = await aiSummarize(created.id);
      const patched = await updateNote(created.id, {
        habit: (ai.habit ?? undefined) as HabitId | undefined,
        quadrant: ai.quadrant ?? undefined,
        tags: ai.suggestedTags ?? [],
      });
      onCreated(patched);

      await Promise.all(
        ai.actionItems.map(async (a) => {
          const preset = QUADRANT_PRESET[a.quadrant as Quadrant];
          await createTask({
            title: a.title,
            habit: (a.habit ?? undefined) as HabitId | undefined,
            tags: a.tags ?? [],
            dueAt: a.due ? new Date(a.due).toISOString() : null,
            importance: preset.importance,
            urgency: preset.urgency,
            noteId: created.id,
          });
        })
      );

      const actions = ai.actionItems
        .map(
          (a) =>
            `- ${a.title} (${a.quadrant}${a.due ? ' ' + new Date(a.due).toLocaleDateString() : ''})`
        )
        .join('\n');
      alert(`Samenvatting: ${ai.summary}\n\nActies:\n${actions}`);
    } catch (err) {
      console.error('AI analyse mislukt', err);
      onCreated(created);
    }
    onClose();
    setTitle('');
    setContent('');
    setScheduled('');

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl backdrop-blur-xl bg-white/10 border border-white/15 p-5 text-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Nieuwe notitie</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">Sluiten</button>
        </div>
        <div className="grid gap-3">
          <input
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (title.trim()) submit();
              }
            }}
          />
          <textarea
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
            placeholder="Inhoud"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="datetime-local"
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
            value={scheduled}
            onChange={(e) => setScheduled(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">
              Annuleren
            </button>
            <button
              onClick={submit}
              disabled={!title.trim()}
              className="px-3 py-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200"
            >
              Aanmaken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
