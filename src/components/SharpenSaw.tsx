import { usePlanner } from '../PlannerContext';
import type { Renewal } from '../models';

function isoWeekLabel(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export default function SharpenSaw() {
  const { state, setState } = usePlanner();
  const week = isoWeekLabel();
  const renewal = state.renewals.find((r) => r.week === week) || {
    id: week,
    week,
    physical: false,
    mental: false,
    emotional: false,
    spiritual: false,
  };

  const update = (field: keyof Renewal) => {
    const updated = { ...renewal, [field]: !renewal[field] };
    setState((s) => {
      const existing = s.renewals.filter((r) => r.week !== week);
      return { ...s, renewals: [...existing, updated] };
    });
  };

  const count = (['physical', 'mental', 'emotional', 'spiritual'] as Array<keyof Renewal>)
    .filter((k) => renewal[k]).length;
  const progress = (count / 4) * 100;

  return (
    <div className="space-y-4" aria-label="sharpen the saw tracker">
      <h2 className="text-xl font-semibold">Sharpen the Saw</h2>
      <div className="space-y-2">
        {(['physical', 'mental', 'emotional', 'spiritual'] as const).map((area) => (
          <label key={area} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={renewal[area]}
              onChange={() => update(area)}
              aria-label={area}
            />
            <span className="capitalize">{area}</span>
          </label>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded h-2" aria-label="progress">
        <div className="bg-green-600 h-2 rounded" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
