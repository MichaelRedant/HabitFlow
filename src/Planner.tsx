import { useEffect, useState } from 'react';

import type React from 'react';

import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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


function DayView({
  current,
  events,
  onQuickAdd,
  onMenu,
}: {
  current: Date;
  events: PlannerEvent[];
  onQuickAdd: (date: Date) => void;
  onMenu: (date: Date, e: React.MouseEvent) => void;
}) {
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00-22:00
  const currentIso = current.toISOString().slice(0, 10);


  return (
    <div className="grid grid-cols-[60px_1fr] gap-x-4 text-sm">
      {hours.map((h) => {
        const evs = events.filter(
          (ev) =>

            ev.date === currentIso &&
            ev.time &&
            Number(ev.time.slice(0, 2)) === h
        );
        return (
          <div key={h} className="contents">
            <div className="text-right pr-2 text-slate-400">{String(h).padStart(2, '0')}:00</div>

            <div
              className="border-b border-slate-700 h-12 cursor-pointer relative"
              onClick={() =>
                onQuickAdd(
                  new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate(),
                    h
                  )
                )
              }
              onContextMenu={(e) => {
                e.preventDefault();
                onMenu(
                  new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate(),
                    h
                  ),
                  e
                );
              }}
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


function WeekView({
  current,
  events,
  onQuickAdd,
  onMenu,
}: {
  current: Date;
  events: PlannerEvent[];
  onQuickAdd: (date: Date) => void;
  onMenu: (date: Date, e: React.MouseEvent) => void;
}) {

  const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  const now = new Date();
  const monday = new Date(current);
  monday.setDate(current.getDate() - ((current.getDay() + 6) % 7));

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

                onClick={() => onQuickAdd(new Date(d))}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onMenu(new Date(d), e);
                }}

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



function MonthView({
  current,
  events,
  onQuickAdd,
  onMenu,
}: {
  current: Date;
  events: PlannerEvent[];
  onQuickAdd: (date: Date) => void;
  onMenu: (date: Date, e: React.MouseEvent) => void;
}) {

  const now = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
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
            onClick={() => onQuickAdd(new Date(c.date))}
            onContextMenu={(e) => {
              e.preventDefault();
              onMenu(new Date(c.date), e);
            }}
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
  const [current, setCurrent] = useState(new Date());

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

  function handleQuickAdd(date: Date) {
    setSelectedDate(date);
    setNoteModal(true);
  }


  function handleMenu(date: Date, e: React.MouseEvent) {
    setMenu({ date, x: e.clientX, y: e.clientY });
  }

  function prev() {
    const d = new Date(current);
    if (view === 'day') d.setDate(d.getDate() - 1);
    if (view === 'week') d.setDate(d.getDate() - 7);
    if (view === 'month') d.setMonth(d.getMonth() - 1);
    setCurrent(d);
  }

  function next() {
    const d = new Date(current);
    if (view === 'day') d.setDate(d.getDate() + 1);
    if (view === 'week') d.setDate(d.getDate() + 7);
    if (view === 'month') d.setMonth(d.getMonth() + 1);
    setCurrent(d);
  }

  function today() {
    setCurrent(new Date());
  }

  let label = '';
  if (view === 'day') {
    label = current.toLocaleDateString('nl-BE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } else if (view === 'week') {
    const monday = new Date(current);
    monday.setDate(current.getDate() - ((current.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    label = `${monday.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })} – ${sunday.toLocaleDateString('nl-BE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`;
  } else {
    label = current.toLocaleDateString('nl-BE', {
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <section className="max-w-5xl mx-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-lg">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              onClick={prev}

              title="Vorige periode"
              aria-label="vorige periode"

            >
              <FiChevronLeft />
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              onClick={today}

              title="Spring naar vandaag"
              aria-label="ga naar vandaag"

            >
              Vandaag
            </button>
            <button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
              onClick={next}
              title="Volgende periode"
              aria-label="volgende periode"

            >
              <FiChevronRight />
            </button>
            <span className="ml-4 font-semibold capitalize">{label}</span>
          </div>

          <div className="flex gap-2">
            <button
              className={cls(
                'px-4 py-2 rounded-lg text-sm transition',
                view === 'day' ? 'bg-white/20 text-teal-300' : 'bg-white/10 hover:bg-white/15'
              )}
              onClick={() => setView('day')}
              title="Toon dagoverzicht"
            >
              Dag
            </button>
            <button
              className={cls(
                'px-4 py-2 rounded-lg text-sm transition',
                view === 'week' ? 'bg-white/20 text-teal-300' : 'bg-white/10 hover:bg-white/15'
              )}
              onClick={() => setView('week')}
              title="Toon weekoverzicht"
            >
              Week
            </button>
            <button
              className={cls(
                'px-4 py-2 rounded-lg text-sm transition',
                view === 'month' ? 'bg-white/20 text-teal-300' : 'bg-white/10 hover:bg-white/15'
              )}
              onClick={() => setView('month')}
              title="Toon maandoverzicht"
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

              title="Voeg een nieuwe taak toe"

            >
              <FiPlus /> Nieuwe taak
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200 text-sm flex items-center gap-2"
              onClick={() => {
                setSelectedDate(new Date());
                setNoteModal(true);
              }}

              title="Maak een nieuwe notitie"

            >
              <FiPlus /> Nieuwe notitie
            </button>
          </div>
        </div>
        <div className="overflow-auto">

          {view === 'day' && (
            <DayView
              current={current}
              events={events}
              onQuickAdd={handleQuickAdd}
              onMenu={handleMenu}
            />
          )}
          {view === 'week' && (
            <WeekView
              current={current}
              events={events}
              onQuickAdd={handleQuickAdd}
              onMenu={handleMenu}
            />
          )}
          {view === 'month' && (
            <MonthView
              current={current}
              events={events}
              onQuickAdd={handleQuickAdd}
              onMenu={handleMenu}
            />
          )}

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

