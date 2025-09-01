import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { createNote, updateNote } from '../services/api';
import { aiSummarize } from '../services/ai';
import type { Note, HabitId, Quadrant } from '../types';

export default function NoteEditor({ onCreated }: { onCreated: (n: Note) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [summary, setSummary] = useState<string | null>(null);


  // Load draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hf.draft.note');
      if (raw) {
        const d = JSON.parse(raw) as { title?: string; content?: string };
        setTitle(d.title ?? '');
        setContent(d.content ?? '');
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Autosave draft
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(
          'hf.draft.note',
          JSON.stringify({ title, content })
        );
      } catch {
        /* ignore */
      }
    }, 500);
    return () => clearTimeout(id);
  }, [title, content]);

  async function save() {
    if (!title.trim() && !content.trim()) return;
    const created = await createNote({ title: title.trim() || 'Untitled', content, tags: [] });
    try {
      const ai = await aiSummarize(created.id);
      const patched = await updateNote(created.id, {
        habit: (ai.habit ?? undefined) as HabitId | undefined,

        quadrant: (ai.quadrant ?? undefined) as Quadrant | undefined,
        tags: ai.suggestedTags ?? [],
      });
      onCreated(patched);
      setSummary(ai.summary);

    } catch {
      onCreated(created);
    }
    setTitle('');
    setContent('');
    localStorage.removeItem('hf.draft.note');
  }

  return (
    <div className="space-y-2" aria-label="note editor">
      <input
        className="w-full p-2 rounded bg-transparent border border-white/10"
        placeholder="Titel"
        aria-label="titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full h-32 p-2 rounded bg-transparent border border-white/10"
        placeholder="Inhoud in markdown"
        aria-label="inhoud"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={save}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200"
        aria-label="bewaar notitie"
      >
        <Save className="w-4 h-4" />
        Bewaar
      </button>

      {summary && (
        <p className="text-sm text-teal-200" aria-live="polite">
          Samenvatting: {summary}
        </p>
      )}

    </div>
  );
}

