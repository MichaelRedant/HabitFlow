import { usePlanner } from '../PlannerContext';
import type { Renewal } from '../models';
import { isoWeekLabel } from '../utils/date';
import GlassCard from './GlassCard';


type Area = 'physical' | 'mental' | 'emotional' | 'spiritual';


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


  const areas: Area[] = ['physical', 'mental', 'emotional', 'spiritual'];
  const count = areas.filter((k) => renewal[k]).length;
  const progress = (count / 4) * 100;
  const labels: Record<Area, string> = {
    physical: 'Fysiek',
    mental: 'Mentaal',
    emotional: 'Emotioneel/Sociaal',
    spiritual: 'Spiritueel',
  };
  const tips: Record<Area, string> = {
    physical: 'Sport, slaap, voeding',
    mental: 'Leren, lezen',
    emotional: 'Relaties, empathie',
    spiritual: 'Zingeving, stilte',
  };

  return (
    <GlassCard className="space-y-4 p-4" aria-label="zaag scherpen">
      <h2 className="text-xl font-semibold">Zaag Scherpen</h2>
      <p className="text-sm text-slate-400">
        Habit 7 draait om zelfvernieuwing. Vink aan waar je deze week in
        investeerde om in balans te blijven.
      </p>
      <div className="space-y-2">
        {areas.map((area) => (
          <label key={area} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={renewal[area]}
              onChange={() => update(area)}
              aria-label={labels[area]}
            />
            <span title={tips[area]}>{labels[area]}</span>
          </label>
        ))}
      </div>
      <div className="w-full bg-gray-700 rounded h-2" aria-label="voortgang">
        <div
          className="bg-green-600 h-2 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{Math.round(progress)}% voltooid</p>
    </GlassCard>
  );
}
