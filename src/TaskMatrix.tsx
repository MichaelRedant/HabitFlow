import { useEffect, useMemo, useState, useCallback } from 'react';
import type { HabitId, Quadrant, Task, TaskStatus } from './types';
import { fetchTasks, updateTask, completeTask } from './services/api';
import { FiCheckSquare, FiSquare, FiClock } from 'react-icons/fi';
import { QUADRANT_PRESET } from './constants';

const HABITS: HabitId[] = [1,2,3,4,5,6,7];
const STATUSES: TaskStatus[] = ['todo','doing','done','blocked','archived'];


export default function TaskMatrix() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habit, setHabit] = useState<'all'|HabitId>('all');
  const [status, setStatus] = useState<TaskStatus|'all'>('todo');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string,string> = {};
    if (habit !== 'all') params.habit = String(habit);
    if (status !== 'all') params.status = status;
    const data = await fetchTasks(params);
    setTasks(data);
    setLoading(false);
  }, [habit, status]);

  useEffect(()=>{ load(); }, [load]);

  const grouped = useMemo(() => {
    const g: Record<Quadrant, Task[]> = { I:[], II:[], III:[], IV:[] };
    tasks.forEach(t => g[t.quadrant].push(t));
    (Object.keys(g) as Quadrant[]).forEach(q => g[q].sort((a,b)=>
      new Date(a.dueAt ?? 0).valueOf() - new Date(b.dueAt ?? 0).valueOf()
    ));
    return g;
  }, [tasks]);

  async function toggleDone(t: Task) {
    const next = await completeTask(t.id, t.status !== 'done');
    setTasks(xs => xs.map(x => x.id === t.id ? next : x));
  }

  async function quickMove(t: Task, q: Quadrant) {
    const next = await updateTask(t.id, QUADRANT_PRESET[q]);
    setTasks(xs => xs.map(x => x.id === t.id ? next : x));
  }

  async function adjust(t: Task, field: 'importance'|'urgency', value: number) {
    const next = await updateTask(t.id, { [field]: value });
    setTasks(xs => xs.map(x => x.id === t.id ? next : x));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select className="px-3 py-2 w-full sm:w-auto rounded-xl bg-white/10 border border-white/10 text-sm"
                value={habit} onChange={e=> setHabit(e.target.value==='all' ? 'all' : Number(e.target.value) as HabitId)}>
          <option value="all">Alle Habits</option>
          {HABITS.map(h=> <option key={h} value={h}>H{h}</option>)}
        </select>

        <select className="px-3 py-2 w-full sm:w-auto rounded-xl bg-white/10 border border-white/10 text-sm"
                value={status} onChange={e=> setStatus(e.target.value as TaskStatus | 'all')}>
          {(['all', ...STATUSES] as const).map(s=> <option key={s} value={s}>{s}</option>)}
        </select>

        {loading && <span className="text-xs text-slate-400">Laden…</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuadrantCol title="Q I — Urgent & Belangrijk" tasks={grouped.I}
          onToggle={toggleDone} onQuickMove={quickMove} onAdjust={adjust} />
        <QuadrantCol title="Q II — Niet urgent & Belangrijk" tasks={grouped.II}
          onToggle={toggleDone} onQuickMove={quickMove} onAdjust={adjust} />
        <QuadrantCol title="Q III — Urgent & Niet belangrijk" tasks={grouped.III}
          onToggle={toggleDone} onQuickMove={quickMove} onAdjust={adjust} />
        <QuadrantCol title="Q IV — Niet urgent & Niet belangrijk" tasks={grouped.IV}
          onToggle={toggleDone} onQuickMove={quickMove} onAdjust={adjust} />
      </div>
    </div>
  );
}

function QuadrantCol(
  { title, tasks, onToggle, onQuickMove, onAdjust }:
  {
    title: string;
    tasks: Task[];
    onToggle: (t: Task)=>void;
    onQuickMove: (t: Task, q: Quadrant)=>void;
    onAdjust: (t: Task, field:'importance'|'urgency', value:number)=>void;
  }
) {
  return (
    <section className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-3 min-h-[40vh]">
      <h3 className="text-sm font-semibold mb-2 text-slate-200">{title}</h3>
      <div className="space-y-2">
        {tasks.map(t => (
          <article key={t.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button onClick={()=>onToggle(t)} className="text-teal-300">
                  {t.status === 'done' ? <FiCheckSquare/> : <FiSquare/>}
                </button>
                <div className="min-w-0">
                  <div className="font-medium break-words">{t.title}</div>
                  {t.description && <div className="text-xs text-slate-400 break-words">{t.description}</div>}
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>H{t.habit ?? '-'}</span>
                    {t.dueAt && <span className="inline-flex items-center gap-1"><FiClock/>{new Date(t.dueAt).toLocaleString()}</span>}
                    <span>imp {t.importance} · urg {t.urgency}</span>
                    <span>status {t.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 flex-wrap">
                {(['I','II','III','IV'] as Quadrant[]).map(q =>
                  <button key={q} onClick={()=>onQuickMove(t, q)}
                    className="px-2 py-1 text-xs rounded-lg bg-white/10 border border-white/10 hover:bg-white/20">→ {q}</button>
                )}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3 items-center">
              <label className="text-xs">Belangrijk: {t.importance}</label>
              <input type="range" min={1} max={5} value={t.importance}
                     onChange={e=>onAdjust(t,'importance', Number(e.target.value))} />
              <label className="text-xs">Urgent: {t.urgency}</label>
              <input type="range" min={1} max={5} value={t.urgency}
                     onChange={e=>onAdjust(t,'urgency', Number(e.target.value))} />
            </div>
          </article>
        ))}

        {tasks.length === 0 && <div className="text-sm text-slate-400">Geen taken in dit kwadrant…</div>}
      </div>
    </section>
  );
}
