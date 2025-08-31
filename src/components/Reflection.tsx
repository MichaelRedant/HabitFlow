import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import type { Reflection } from '../models';
import { isoWeekLabel } from '../utils/date';

export default function Reflection() {
  const { state, setState } = usePlanner();
  const week = isoWeekLabel();
  const existing = state.reflections.find((r) => r.week === week);
  const [weekly, setWeekly] = useState(existing?.weekly ?? '');
  const [monthly, setMonthly] = useState(existing?.monthly ?? '');

  const save = () => {
    const refl: Reflection = { id: week, week, weekly, monthly };
    setState((s) => {
      const others = s.reflections.filter((r) => r.week !== week);
      return { ...s, reflections: [...others, refl] };
    });
  };

  return (
    <div className="space-y-4" aria-label="reflectie">
      <h2 className="text-xl font-semibold">Reflectie</h2>
      <p className="text-sm text-slate-400">
        Sta kort stil bij je week. Deze vragen helpen je vooruit, ook zonder de 7
        Habits gelezen te hebben.
      </p>
      <div>
        <label className="block font-medium" htmlFor="weekly">
          Was ik proactief of reactief?
        </label>
        <textarea
          id="weekly"
          className="bg-transparent border w-full p-2 h-24 rounded"
          placeholder="Voorbeelden, situaties, inzichten..."
          value={weekly}
          onChange={(e) => setWeekly(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium" htmlFor="monthly">
          Hoe sloten mijn acties aan bij mijn missie en waarden?
        </label>
        <textarea
          id="monthly"
          className="bg-transparent border w-full p-2 h-24 rounded"
          placeholder="Wat gaf energie? Wat kan beter?"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-600 text-white px-2 py-1 rounded"
        onClick={save}
      >
        Bewaar reflectie
      </button>
    </div>
  );
}

