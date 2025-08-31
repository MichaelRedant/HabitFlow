import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Note } from '../models';

const dayLabel = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function todayName() {
  return dayLabel[new Date().getDay()];
}

export default function DailyPage() {
  const { state, setState } = usePlanner();
  const day = todayName();
  const tasks = state.tasks.filter((t) => t.day === day);
  const priorities = tasks.filter((t) => t.type === 'rock').slice(0, 3);
  const [note, setNote] = useState('');

  const addNote = () => {
    if (!note.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      content: note,
      tags: ['daily', day],
      linkedWeek: undefined,
    };
    setState((s) => ({ ...s, notes: [newNote, ...s.notes] }));
    setNote('');
  };

  return (
    <div className="space-y-4" aria-label="daily page">
      <h2 className="text-xl font-semibold">Today</h2>
      <div>
        <h3 className="font-medium">Top Priorities</h3>
        <ul className="list-disc ml-5">
          {priorities.map((t) => (
            <li key={t.id}>{t.time} {t.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Schedule</h3>
        <ul className="list-disc ml-5">
          {tasks.map((t) => (
            <li key={t.id} className={t.type === 'rock' ? 'text-blue-700' : ''}>
              {t.time} {t.title}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Quick Notes & Gratitude</h3>
        <textarea
          className="border w-full h-24 p-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-label="quick note"
        />
        <button className="bg-blue-600 text-white px-2 py-1 rounded mt-1" onClick={addNote}>
          Save
        </button>
      </div>
      <div>
        <h3 className="font-medium">Linked Tasks</h3>
        <ul className="list-disc ml-5">
          {tasks.filter((t) => t.linkedGoalId).map((t) => (
            <li key={t.id}>{t.time} {t.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Recent Notes</h3>
        <ul className="space-y-2">
          {state.notes.filter((n) => n.tags.includes('daily')).slice(0,5).map((n) => (
            <li key={n.id} className="border p-2 rounded">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{n.content}</ReactMarkdown>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
