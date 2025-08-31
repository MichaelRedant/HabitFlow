import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePlanner } from '../PlannerContext';
import type { Note } from '../models';
import NoteMatrix from './NoteMatrix';

export default function Notes() {
  const { state, setState } = usePlanner();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');
  const [week, setWeek] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  const addNote = () => {
    if (!content.trim()) return;
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const lowerTags = tagList.map((t) => t.toLowerCase());
    const autoUrgent = lowerTags.includes('urgent') || lowerTags.includes('dringend');
    const autoImportant =
      lowerTags.includes('belangrijk') ||
      lowerTags.includes('important') ||
      Boolean(linkedGoalId);
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      tags: tagList,
      linkedGoalId: linkedGoalId || undefined,
      linkedWeek: week || undefined,
      urgent: urgent || autoUrgent,
      important: important || autoImportant,
    };
    setState((s) => ({ ...s, notes: [newNote, ...s.notes] }));
    setContent('');
    setTags('');
    setLinkedGoalId('');
    setWeek('');
    setUrgent(false);
    setImportant(false);
  };

  const filteredNotes = useMemo(() => state.notes, [state.notes]);

  return (
    <div className="space-y-4" aria-label="notities sectie">
      <h2 className="text-xl font-semibold">Notities</h2>
      <div className="space-y-2">
        <textarea
          className="w-full h-32 border p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Notitie in markdown"
          aria-label="inhoud notitie"
        />
        <input
          className="border p-1 w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags, komma gescheiden"
          aria-label="notitie tags"
        />
        <div className="flex space-x-4">
          <label className="flex items-center space-x-1">
            <input type="checkbox" checked={urgent} onChange={() => setUrgent((v) => !v)} />
            <span>Dringend</span>
          </label>
          <label className="flex items-center space-x-1">
            <input type="checkbox" checked={important} onChange={() => setImportant((v) => !v)} />
            <span>Belangrijk</span>
          </label>
        </div>
        <select
          className="border p-1 w-full"
          value={linkedGoalId}
          onChange={(e) => setLinkedGoalId(e.target.value)}
          aria-label="koppel aan doel"
        >
          <option value="">Koppel aan doel</option>
          {state.goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.description}
            </option>
          ))}
        </select>
        <input
          className="border p-1 w-full"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          placeholder="Weeklabel (bv. 2025-W35)"
          aria-label="koppel aan week"
        />
        <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={addNote}>
          Voeg notitie toe
        </button>
      </div>
      <ul className="space-y-4">
        {filteredNotes.map((n) => (
          <li key={n.id} className="border p-2 rounded">
            <div className="text-sm text-gray-400">Labels: {n.tags.join(', ')}</div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{n.content}</ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
      <NoteMatrix notes={filteredNotes} />
    </div>
  );
}
