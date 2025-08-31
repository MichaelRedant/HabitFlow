import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePlanner } from '../PlannerContext';
import remarkGfm from 'remark-gfm';

export default function MissionValues() {
  const { state, setState } = usePlanner();
  const [editing, setEditing] = useState(false);
  const user = state.user;

  const save = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-2" aria-label="missie en waarden">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Missie & Waarden</h2>
        <button
          className="text-sm text-blue-400 underline"
          onClick={() => setEditing((e) => !e)}
          aria-label={editing ? 'toon voorbeeld' : 'bewerk missie en waarden'}
          title={editing ? 'Toon voorbeeld' : 'Bewerk missie en waarden'}
        >
          {editing ? 'Voorbeeld' : 'Bewerk'}
        </button>
      </div>
      <p className="text-sm text-slate-300">Formuleer je persoonlijke missie en de waarden die je richting geven.</p>
      {editing ? (
        <div className="space-y-2">
          <div>
            <textarea
              className="w-full h-40 p-2 border rounded bg-gray-800"
              value={user.mission}
              onChange={(e) =>
                setState((s) => ({ ...s, user: { ...s.user, mission: e.target.value } }))
              }
              aria-label="missie"
              placeholder="Jouw missie in markdown"
            />
            <p className="text-xs text-slate-400 mt-1">Tip: beschrijf in 1-2 zinnen wat je drijft.</p>
          </div>
          <div>
            <textarea
              className="w-full h-40 p-2 border rounded bg-gray-800"
              value={user.values}
              onChange={(e) =>
                setState((s) => ({ ...s, user: { ...s.user, values: e.target.value } }))
              }
              aria-label="kernwaarden"
              placeholder="Jouw kernwaarden in markdown"
            />
            <p className="text-xs text-slate-400 mt-1">Som je kernwaarden op, gescheiden door nieuwe regels.</p>
          </div>
          <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={save}>
            Bewaar
          </button>
        </div>
      ) : (
        !user.mission && !user.values ? (
          <p className="text-slate-400 text-sm">Nog niets ingevuld. Klik op 'Bewerk' om te starten.</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{`## Missie\n${user.mission}`}</ReactMarkdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{`## Waarden\n${user.values}`}</ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}
