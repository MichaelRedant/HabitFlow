import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePlanner } from '../PlannerContext';
import type { Note } from '../models';

export default function Notes() {
  const { state, setState } = usePlanner();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');
  const [week, setWeek] = useState('');

  const addNote = () => {
    if (!content.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      linkedGoalId: linkedGoalId || undefined,
      linkedWeek: week || undefined,
    };
    setState((s) => ({ ...s, notes: [newNote, ...s.notes] }));
    setContent('');
    setTags('');
    setLinkedGoalId('');
    setWeek('');
  };

  const filteredNotes = state.notes; // could add search

  return (
    <div className="space-y-4" aria-label="notes section">
      <h2 className="text-xl font-semibold">Notes</h2>
      <div className="space-y-2">
        <textarea
          className="w-full h-32 border p-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note in markdown"
          aria-label="note content"
        />
        <input
          className="border p-1 w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags comma separated"
          aria-label="note tags"
        />
        <select
          className="border p-1 w-full"
          value={linkedGoalId}
          onChange={(e) => setLinkedGoalId(e.target.value)}
          aria-label="link to goal"
        >
          <option value="">Link to goal</option>
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
          placeholder="Week label (e.g. 2025-W35)"
          aria-label="link to week"
        />
        <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={addNote}>
          Add Note
        </button>
      </div>
      <ul className="space-y-4">
        {filteredNotes.map((n) => (
          <li key={n.id} className="border p-2 rounded">
            <div className="text-sm text-gray-500">Tags: {n.tags.join(', ')}</div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{n.content}</ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
