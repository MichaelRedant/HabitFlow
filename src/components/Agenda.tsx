
import { useEffect, useMemo, useState } from 'react';

import { usePlanner } from '../PlannerContext';
import GlassCard from './GlassCard';
import type { Task } from '../models';


interface ExtEvent {
  id: string;
  title: string;
  day: string;
  time: string;
}

function parseICS(text: string): ExtEvent[] {
  const events: ExtEvent[] = [];
  const lines = text.split(/\r?\n/);
  let current: Record<string, string> | null = null;
  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) current = {};
    else if (line.startsWith('END:VEVENT')) {
      if (current && current.DTSTART && current.SUMMARY) {
        const dt = current.DTSTART.replace(/[^0-9]/g, '');
        const day = `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)}`;
        const time = dt.length > 8 ? `${dt.slice(9, 11)}:${dt.slice(11, 13)}` : '00:00';
        events.push({
          id: current.UID || `${dt}-${current.SUMMARY}`,
          title: current.SUMMARY,
          day,
          time,
        });
      }
      current = null;
    } else if (current) {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).split(';')[0];
        const val = line.slice(idx + 1);
        current[key] = val;
      }
    }
  }
  return events;
}

export default function Agenda() {
  const { state } = usePlanner();
  const [url, setUrl] = useState(() => localStorage.getItem('hf.calendarUrl') || '');
  const [extEvents, setExtEvents] = useState<ExtEvent[]>([]);

  useEffect(() => {
    if (!url) {
      setExtEvents([]);
      return;
    }
    localStorage.setItem('hf.calendarUrl', url);
    fetch(url)
      .then((r) => r.text())
      .then((txt) => setExtEvents(parseICS(txt)))
      .catch(() => setExtEvents([]));
  }, [url]);

  const groups = useMemo(() => {
    const merged: Task[] = [
      ...state.tasks,
      ...extEvents.map((e) => ({ ...e, type: 'sand' as const })),
    ];
    const sorted = merged.sort((a, b) =>

      a.day.localeCompare(b.day) || a.time.localeCompare(b.time)
    );
    return sorted.reduce<Record<string, Task[]>>((acc, t) => {
      acc[t.day] = acc[t.day] ? [...acc[t.day], t] : [t];
      return acc;
    }, {});

  }, [state.tasks, extEvents]);


  return (
    <div className="space-y-4" aria-label="agenda">
      <h2 className="text-xl font-semibold">Agenda</h2>

      <div className="flex items-center space-x-2">
        <input
          className="bg-transparent border border-white/10 p-1 flex-1 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="ICS URL van Google of Microsoft"
          aria-label="extern agenda url"
        />
      </div>
      <ul className="space-y-4 mt-4">

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

        {Object.keys(groups).length === 0 && (
          <li>
            <GlassCard className="p-2">Geen geplande taken</GlassCard>
          </li>
        )}

      </ul>
    </div>
  );
}
