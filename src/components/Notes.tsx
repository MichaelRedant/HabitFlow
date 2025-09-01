import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trash } from 'lucide-react';
import NoteEditor from './NoteEditor';
import GlassCard from './GlassCard';
import { fetchNotes, deleteNote } from '../services/api';
import type { Note } from '../types';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotes().then(setNotes).catch(() => setNotes([]));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter((n) => {
      const text = `${n.title} ${n.content ?? ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [notes, search]);

  async function remove(id: number) {
    await deleteNote(id);
    setNotes((ns) => ns.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-4" aria-label="notities sectie">
      <h2 className="text-xl font-semibold">Notities</h2>
      <input
        className="border p-1 w-full"
        placeholder="Zoek notities"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="zoek notities"
      />
      <GlassCard className="p-4">
        <NoteEditor onCreated={(n) => setNotes((prev) => [n, ...prev])} />
      </GlassCard>
      <ul className="space-y-4">
        {filtered.map((n) => (
          <li key={n.id}>
            <GlassCard className="p-2">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{n.title}</h3>
                <button
                  onClick={() => remove(n.id)}
                  className="text-red-500 hover:underline"
                  aria-label="verwijder notitie"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{n.content ?? ''}</ReactMarkdown>
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

