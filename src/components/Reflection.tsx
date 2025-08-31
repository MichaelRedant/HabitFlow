import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import type { Reflection } from '../models';

function isoWeekLabel(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

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
      <div>
        <label className="block font-medium" htmlFor="weekly">Was ik proactief of reactief?</label>
        <textarea
          id="weekly"
          className="border w-full p-2 h-24"
          value={weekly}
          onChange={(e) => setWeekly(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium" htmlFor="monthly">Hoe goed sloten mijn taken aan bij mijn missie en waarden?</label>
        <textarea
          id="monthly"
          className="border w-full p-2 h-24"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
      </div>
      <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={save}>
        Bewaar
      </button>
    </div>
  );
}
