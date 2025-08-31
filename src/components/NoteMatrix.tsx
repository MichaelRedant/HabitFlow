import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Note } from '../models';
import { usePlanner } from '../PlannerContext';

export default function NoteMatrix({ notes }: { notes?: Note[] }) {
  const { state } = usePlanner();
  const list = notes ?? state.notes;
  const q1 = list.filter((n) => n.urgent && n.important);
  const q2 = list.filter((n) => !n.urgent && n.important);
  const q3 = list.filter((n) => n.urgent && !n.important);
  const q4 = list.filter((n) => !n.urgent && !n.important);

  const quadrant = (title: string, items: Note[]) => (
    <div className="border rounded p-2 bg-white/5 animate-fade-in">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc ml-4 space-y-1">
        {items.map((n) => (
          <li key={n.id} className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{n.summary || n.content}</ReactMarkdown>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 mt-4" aria-label="covey-matrix">
      {quadrant('Belangrijk & Dringend', q1)}
      {quadrant('Belangrijk maar niet dringend', q2)}
      {quadrant('Dringend maar niet belangrijk', q3)}
      {quadrant('Niet belangrijk & niet dringend', q4)}
    </div>
  );
}
