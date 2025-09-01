import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import type { Reflection } from '../models';
import { isoWeekLabel } from '../utils/date';
import GlassCard from './GlassCard';

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
    <GlassCard className="space-y-4 p-4" aria-label="reflectie">
      <h2 className="text-xl font-semibold">Reflectie</h2>
      <p className="text-sm text-slate-400">
        Sta stil bij je week: wat ging goed, wat kan beter? Deze oefening
        ondersteunt Habit 7 en helpt je gericht te groeien.
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
    </GlassCard>
  );
}

