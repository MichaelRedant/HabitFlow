import { useEffect, useState } from 'react';
import type { HabitId, Quadrant, Task } from './types';
import { createTask } from './services/api';

const HABITS: HabitId[] = [1,2,3,4,5,6,7];
const QUICK: Record<Quadrant,{importance:number;urgency:number}> = {
  I:{importance:5,urgency:5}, II:{importance:5,urgency:2}, III:{importance:2,urgency:5}, IV:{importance:2,urgency:2}
};

export default function CreateTaskModal(
  { open, onClose, onCreated, initialDate }:
  { open: boolean; onClose: ()=>void; onCreated: (t: Task)=>void; initialDate?: Date | null }
) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [habit, setHabit] = useState<HabitId|''>('');
  const [importance, setImportance] = useState(5);
  const [urgency, setUrgency] = useState(2);
  const [dueAt, setDueAt] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if (open) {
      setDueAt(initialDate ? initialDate.toISOString().slice(0,16) : '');
    }
  }, [open, initialDate]);

  if (!open) return null;

  async function submit() {
    const input = {
      title: title.trim(),
      description: description.trim() || undefined,
      habit: habit === '' ? null : habit,
      importance, urgency,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      tags: tags.split(',').map(s=>s.trim()).filter(Boolean),
      status: 'todo' as const,
      quadrant: 'IV' as Quadrant,
    };
    const created = await createTask(input);
    onCreated(created);
    onClose();
    setTitle(''); setDescription(''); setHabit(''); setImportance(5); setUrgency(2); setDueAt(''); setTags('');
  }

  function applyQuick(q: Quadrant) {
    setImportance(QUICK[q].importance);
    setUrgency(QUICK[q].urgency);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl backdrop-blur-xl bg-white/10 border border-white/15 p-5 text-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Nieuwe taak</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/10 border border-white/15">Sluiten</button>
        </div>

        <div className="grid gap-3">
          <input className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
                 placeholder="Titel" value={title} onChange={e=>setTitle(e.target.value)} />

          <textarea className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
                    placeholder="Beschrijving" rows={3}
                    value={description} onChange={e=>setDescription(e.target.value)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select className="px-3 py-2 w-full rounded-lg bg-white/10 border border-white/15"
                    value={habit === '' ? '' : habit}
                    onChange={e=> setHabit(e.target.value === '' ? '' : Number(e.target.value) as HabitId)}>
              <option value="">Habit (optioneel)</option>
              {HABITS.map(h => <option key={h} value={h}>H{h}</option>)}
            </select>

            <input type="datetime-local" className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
                   value={dueAt} onChange={e=>setDueAt(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <label className="text-sm">Belangrijkheid: {importance}</label>
            <input type="range" min={1} max={5} value={importance} onChange={e=>setImportance(Number(e.target.value))}
                   className="w-full" />
            <label className="text-sm">Urgentie: {urgency}</label>
            <input type="range" min={1} max={5} value={urgency} onChange={e=>setUrgency(Number(e.target.value))}
                   className="w-full" />
          </div>

          <div className="flex gap-2 text-xs">
            {(['I','II','III','IV'] as Quadrant[]).map(q =>
              <button key={q} onClick={()=>applyQuick(q)}
                className="px-2 py-1 rounded-lg bg-white/10 border border-white/15 hover:bg-white/20">
                Quick {q}
              </button>
            )}
          </div>

          <input className="px-3 py-2 rounded-lg bg-white/10 border border-white/15"
                 placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">Annuleren</button>
            <button onClick={submit}
                    disabled={!title.trim()}
                    className="px-3 py-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200">
              Aanmaken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
