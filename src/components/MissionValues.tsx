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
    <div className="space-y-2" aria-label="Mission and values">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Mission & Values</h2>
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => setEditing((e) => !e)}
          aria-label={editing ? 'preview mission and values' : 'edit mission and values'}
        >
          {editing ? 'Preview' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <div className="space-y-2">
          <textarea
            className="w-full h-40 p-2 border rounded"
            value={user.mission}
            onChange={(e) =>
              setState((s) => ({ ...s, user: { ...s.user, mission: e.target.value } }))
            }
            aria-label="mission statement"
            placeholder="Your mission in markdown"
          />
          <textarea
            className="w-full h-40 p-2 border rounded"
            value={user.values}
            onChange={(e) =>
              setState((s) => ({ ...s, user: { ...s.user, values: e.target.value } }))
            }
            aria-label="core values"
            placeholder="Your core values in markdown"
          />
          <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={save}>
            Save
          </button>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{`## Mission\n${user.mission}`}</ReactMarkdown>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{`## Values\n${user.values}`}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
