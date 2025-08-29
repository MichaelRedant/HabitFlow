import { useState } from 'react';
import type React from 'react';
import { FiPlus } from 'react-icons/fi';
import CreateTaskModal from './CreateTaskModal';
import CreateNoteModal from './CreateNoteModal';

const cls = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ');

function DayView({ onSelect }: { onSelect: (date: Date, e: React.MouseEvent) => void }) {
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00-22:00
  const today = new Date();
  return (
    <div className="grid grid-cols-[60px_1fr] gap-x-4 text-sm">
      {hours.map((h) => (
        <div key={h} className="contents">
          <div className="text-right pr-2 text-slate-400">{String(h).padStart(2, '0')}:00</div>
          <div
            className="border-b border-slate-700 h-12 cursor-pointer"
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
          />
        </div>
      ))}
    </div>
  );
}

function WeekView({ onSelect }: { onSelect: (date: Date, e: React.MouseEvent) => void }) {
  const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return (
    <div className="grid grid-cols-[60px_repeat(7,1fr)] text-sm">
      <div />
      {days.map((d) => (
        <div key={d} className="text-center font-medium py-2 border-l border-slate-700">
          {d}
        </div>
      ))}
      {hours.map((h) => (
        <div key={h} className="contents">
          <div className="text-right pr-2 text-slate-400 border-t border-slate-700">
            {String(h).padStart(2, '0')}:00
          </div>
          {days.map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            d.setHours(h, 0, 0, 0);
            return (
              <div
                key={i}
                className="border-l border-t border-slate-700 h-12 cursor-pointer"
                onClick={(e) => onSelect(d, e)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MonthView({ onSelect }: { onSelect: (date: Date, e: React.MouseEvent) => void }) {
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
      {cells.map((c, i) => (
        <div
          key={i}
          className={cls(
            'h-24 border-b border-r border-slate-700 p-1 cursor-pointer',
            c.current ? '' : 'bg-white/5 text-slate-500'
          )}
          onClick={(e) => onSelect(new Date(c.date), e)}
        >
          <div className="text-right text-xs">{c.date.getDate()}</div>
        </div>
      ))}
    </div>
  );
}

export default function Planner() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [taskModal, setTaskModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [menu, setMenu] = useState<{ date: Date; x: number; y: number } | null>(null);

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
          {view === 'day' && <DayView onSelect={handleSelect} />}
          {view === 'week' && <WeekView onSelect={handleSelect} />}
          {view === 'month' && <MonthView onSelect={handleSelect} />}
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
        onCreated={() => {}}
        initialDate={selectedDate}
      />
      <CreateNoteModal
        open={noteModal}
        onClose={() => setNoteModal(false)}
        onCreated={() => {}}
        initialDate={selectedDate}
      />
    </div>
  );
}

