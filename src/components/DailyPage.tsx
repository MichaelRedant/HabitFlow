import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Note } from '../models';

const dayLabel = ['Zo','Ma','Di','Wo','Do','Vr','Za'];

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
      tags: ['dagelijks', day],
      linkedWeek: undefined,
      urgent: false,
      important: false,
    };
    setState((s) => ({ ...s, notes: [newNote, ...s.notes] }));
    setNote('');
  };

  return (
    <div className="space-y-4" aria-label="dagpagina">
      <h2 className="text-xl font-semibold">Vandaag</h2>
      <div>
        <h3 className="font-medium">Top 3 Prioriteiten</h3>
        <ul className="list-disc ml-5">
          {priorities.map((t) => (
            <li key={t.id}>{t.time} {t.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Planning</h3>
        <ul className="list-disc ml-5">
          {tasks.map((t) => (
            <li key={t.id} className={t.type === 'rock' ? 'text-blue-400' : ''}>
              {t.time} {t.title}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Snelle notities & dankbaarheid</h3>
        <textarea
          className="border w-full h-24 p-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-label="snelle notitie"
        />
        <button className="bg-blue-600 text-white px-2 py-1 rounded mt-1" onClick={addNote}>
          Bewaar
        </button>
      </div>
      <div>
        <h3 className="font-medium">Gekoppelde taken</h3>
        <ul className="list-disc ml-5">
          {tasks.filter((t) => t.linkedGoalId).map((t) => (
            <li key={t.id}>{t.time} {t.title}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium">Recente notities</h3>
        <ul className="space-y-2">
          {state.notes.filter((n) => n.tags.includes('dagelijks')).slice(0,5).map((n) => (
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
