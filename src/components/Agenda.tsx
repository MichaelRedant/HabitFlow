import { useMemo } from 'react';
import { usePlanner } from '../PlannerContext';
import GlassCard from './GlassCard';
import type { Task } from '../models';

export default function Agenda() {
  const { state } = usePlanner();
  const groups = useMemo(() => {
    const sorted = [...state.tasks].sort((a, b) =>
      a.day.localeCompare(b.day) || a.time.localeCompare(b.time)
    );
    return sorted.reduce<Record<string, Task[]>>((acc, t) => {
      acc[t.day] = acc[t.day] ? [...acc[t.day], t] : [t];
      return acc;
    }, {});
  }, [state.tasks]);

  return (
    <div className="space-y-4" aria-label="agenda">
      <h2 className="text-xl font-semibold">Agenda</h2>
      <ul className="space-y-4">
        {Object.entries(groups).map(([date, tasks]) => (
          <li key={date}>
            <GlassCard className="p-2">
              <h3 className="font-medium mb-2">
                {new Date(date).toLocaleDateString('nl-BE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
              <ul className="space-y-1">
                {tasks.map((t) => (
                  <li key={t.id}>
                    {t.time} {t.title}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
