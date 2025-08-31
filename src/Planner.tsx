import { useEffect, useState } from 'react';

import type React from 'react';

import { FiPlus } from 'react-icons/fi';
import CreateTaskModal from './CreateTaskModal';
import CreateNoteModal from './CreateNoteModal';


const cls = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ');

interface PlannerEvent {
  id: string | number;
  type: 'task' | 'note';
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
}

function DayView({ events, onSelect }: { events: PlannerEvent[]; onSelect: (date: Date, e: React.MouseEvent) => void }) {
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00-22:00
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  return (
    <div className="grid grid-cols-[60px_1fr] gap-x-4 text-sm">
      {hours.map((h) => {
        const evs = events.filter(
          (ev) =>
            ev.date === todayIso &&
            ev.time &&
            Number(ev.time.slice(0, 2)) === h
        );
        return (
          <div key={h} className="contents">
            <div className="text-right pr-2 text-slate-400">{String(h).padStart(2, '0')}:00</div>

            <div
              className="border-b border-slate-700 h-12 cursor-pointer relative"
              onClick={(e) =>
                onSelect(
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    h
                  ),
                  e
                )
              }
            >
              {evs.map((ev) => (
                <div
                  key={ev.id}
                  className="absolute inset-0 m-1 rounded bg-teal-500/30 text-xs p-1 overflow-hidden"
                >
                  {ev.title}
                </div>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}


function WeekView({ events, onSelect }: { events: PlannerEvent[]; onSelect: (date: Date, e: React.MouseEvent) => void }) {
  const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  return (
    <div className="grid grid-cols-[60px_repeat(7,1fr)] text-sm">
      <div />
      {days.map((d, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const isToday =
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();
        return (
          <div
            key={d}
            className={cls(
              'text-center font-medium py-2 border-l border-slate-700',
              isToday && 'bg-teal-500/20 text-teal-200'
            )}
          >
            {d} {date.getDate()}/{date.getMonth() + 1}
          </div>
        );
      })}
      {hours.map((h) => (
        <div key={h} className="contents">
          <div className="text-right pr-2 text-slate-400 border-t border-slate-700">
            {String(h).padStart(2, '0')}:00
          </div>

        {days.map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            d.setHours(h, 0, 0, 0);
            const iso = d.toISOString().slice(0, 10);
            const evs = events.filter(
              (ev) =>
                ev.date === iso &&
                ev.time &&
                Number(ev.time.slice(0, 2)) === h
            );
            return (
              <div
                key={i}
                className="border-l border-t border-slate-700 h-12 cursor-pointer relative"
                onClick={(e) => onSelect(d, e)}
              >
                {evs.map((ev) => (
                  <div
                    key={ev.id}
                    className="absolute inset-0 m-1 rounded bg-teal-500/30 text-xs p-1 overflow-hidden"
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}

        </div>
      ))}
    </div>
  );
}


function MonthView({ events, onSelect }: { events: PlannerEvent[]; onSelect: (date: Date, e: React.MouseEvent) => void }) {

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const start = (first.getDay() + 6) % 7; // maandag = 0
  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(year, month, i - start + 1);
    return { date, current: date.getMonth() === month };
  });
  const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  return (
    <div className="grid grid-cols-7 text-sm">
      {weekDays.map((d) => (
        <div key={d} className="text-center font-medium py-2 border-b border-slate-700">
          {d}
        </div>
      ))}
      {cells.map((c, i) => {
        const isToday =
          c.date.getDate() === now.getDate() &&
          c.date.getMonth() === now.getMonth() &&
          c.date.getFullYear() === now.getFullYear();
        const iso = c.date.toISOString().slice(0, 10);
        const evs = events.filter((ev) => ev.date === iso);
        return (
          <div
            key={i}
            className={cls(
              'h-24 border-b border-r border-slate-700 p-1 cursor-pointer',
              c.current ? '' : 'bg-white/5 text-slate-500',
              isToday && 'bg-teal-500/20 text-teal-200'
            )}
            onClick={(e) => onSelect(new Date(c.date), e)}
          >
            <div className="text-right text-xs">{c.date.getDate()}</div>
            {evs.slice(0, 3).map((ev) => (
              <div
                key={ev.id}
                className="mt-1 text-xs truncate rounded bg-teal-500/30 px-1"
              >
                {ev.title}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Planner() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  const [taskModal, setTaskModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [menu, setMenu] = useState<{ date: Date; x: number; y: number } | null>(null);
  const [events, setEvents] = useState<PlannerEvent[]>(() => {
    try {
      const raw = localStorage.getItem('hf.events');
      return raw ? (JSON.parse(raw) as PlannerEvent[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hf.events', JSON.stringify(events));
    } catch {
      /* ignore */
    }
  }, [events]);

  function addEvent(ev: PlannerEvent) {
    setEvents((prev) => [...prev, ev]);
  }

  function handleSelect(date: Date, e: React.MouseEvent) {
    setMenu({ date, x: e.clientX, y: e.clientY });
  }


  return (
    <div className="p-8">
      <section className="max-w-5xl mx-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-lg">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              className={cls(
                'px-4 py-2 rounded-lg text-sm transition',
                view === 'day' ? 'bg-white/20 text-teal-300' : 'bg-white/10 hover:bg-white/15'
              )}
              onClick={() => setView('day')}
            >
              Dag
            </button>
            <button
              className={cls(
                'px-4 py-2 rounded-lg text-sm transition',
                view === 'week' ? 'bg-white/20 text-teal-300' : 'bg-white/10 hover:bg-white/15'
              )}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={cls(
                'px-4 py-2 rounded-lg text-sm transition',
                view === 'month' ? 'bg-white/20 text-teal-300' : 'bg-white/10 hover:bg-white/15'
              )}
              onClick={() => setView('month')}
            >
              Maand
            </button>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200 text-sm flex items-center gap-2"

              onClick={() => {
                setSelectedDate(new Date());
                setTaskModal(true);
              }}

            >
              <FiPlus /> Nieuwe taak
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200 text-sm flex items-center gap-2"

              onClick={() => {
                setSelectedDate(new Date());
                setNoteModal(true);
              }}

            >
              <FiPlus /> Nieuwe notitie
            </button>
          </div>

        </div>
        <div className="overflow-auto">
          {view === 'day' && <DayView events={events} onSelect={handleSelect} />}
          {view === 'week' && <WeekView events={events} onSelect={handleSelect} />}
          {view === 'month' && <MonthView events={events} onSelect={handleSelect} />}
        </div>
      </section>
      {menu && (
        <div className="fixed inset-0 z-40" onClick={() => setMenu(null)}>
          <div
            className="absolute bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex flex-col"
            style={{ left: menu.x, top: menu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="px-3 py-2 hover:bg-white/20 text-left"
              onClick={() => {
                setSelectedDate(menu.date);
                setTaskModal(true);
                setMenu(null);
              }}
            >
              Nieuwe taak
            </button>
            <button
              className="px-3 py-2 hover:bg-white/20 text-left"
              onClick={() => {
                setSelectedDate(menu.date);
                setNoteModal(true);
                setMenu(null);
              }}
            >
              Nieuwe notitie
            </button>
          </div>
        </div>
      )}
      <CreateTaskModal
        open={taskModal}
        onClose={() => setTaskModal(false)}
        onCreated={(t) => {
          addEvent({
            id: t.id,
            type: 'task',
            title: t.title,
            date:
              t.dueAt?.slice(0, 10) ||
              (selectedDate
                ? selectedDate.toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10)),
            time: t.dueAt?.slice(11, 16),
          });
        }}
        initialDate={selectedDate}
      />
      <CreateNoteModal
        open={noteModal}
        onClose={() => setNoteModal(false)}
        onCreated={(n) => {
          addEvent({
            id: n.id,
            type: 'note',
            title: n.title,
            date:
              n.scheduledAt?.slice(0, 10) ||
              (selectedDate
                ? selectedDate.toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10)),
            time: n.scheduledAt?.slice(11, 16),
          });
        }}
        initialDate={selectedDate}
      />

    </div>
  );
}

