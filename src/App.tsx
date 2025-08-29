import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus, FiTrash2, FiCopy, FiCheck, FiClock } from "react-icons/fi";
import { BookOpen, Rocket, Sparkles, Target, Timer, Tags } from "lucide-react";
import { fetchNotes, createNote as apiCreateNote } from "./services/api";
import type { Note, HabitId, Quadrant } from "./types";

const HABITS: {id: HabitId; name: string}[] = [
  { id: 1, name: "Be Proactive" },
  { id: 2, name: "Begin with the End in Mind" },
  { id: 3, name: "Put First Things First" },
  { id: 4, name: "Think Win-Win" },
  { id: 5, name: "Seek First to Understand" },
  { id: 6, name: "Synergize" },
  { id: 7, name: "Sharpen the Saw" },
];

const QUADRANTS: {id: Quadrant; label: string}[] = [
  { id: "I",  label: "Urgent • Belangrijk" },
  { id: "II", label: "Niet urgent • Belangrijk" },
  { id: "III",label: "Urgent • Niet belangrijk" },
  { id: "IV", label: "Niet urgent • Niet belangrijk" },
];

const STORAGE_KEY = "habitflow_notes_v1";

const cls = (...xs: Array<string|false|undefined>) => xs.filter(Boolean).join(" ");

const templates = {
  meeting(): Omit<Note,"id"|"createdAt"|"updatedAt"> {
    return {
      title: `Meeting — ${new Date().toLocaleString()}`,
      content: `# Meeting
**Doel (Habit 2):**  
**Deelnemers:**  

---
## Agenda
1.  
2.  
3.  

## Beslissingen (Habit 3)
-  

## Acties (Win–Win eigenaar + deadline)
- [ ] @naam — actie — dd/mm  

## Notities (Habit 5 samenvatting)
-  `,
      habit: 5,
      quadrant: "II",
      tags: ["meeting"],
    };
  },
  weekly(): Omit<Note,"id"|"createdAt"|"updatedAt"> {
    return {
      title: `Weekly Compass — ${getIsoWeekLabel()}`,
      content: `# Weekly Compass
## Rollen & Doelen (Habit 2)
- Persoonlijk:  
- Teamlead:  
- Project:  

## Grote Keien (Habit 3 / QII)
- [ ]  
- [ ]  
- [ ]  

## Sharpen the Saw (Habit 7)
- Body:  
- Mind:  
- Social/Emo:  
- Spirit:  `,
      habit: 3,
      quadrant: "II",
      tags: ["weekly"],
    };
  },
  daily(): Omit<Note,"id"|"createdAt"|"updatedAt"> {
    return {
      title: `Daily Big Rocks — ${new Date().toLocaleDateString()}`,
      content: `# Daily Big Rocks
## Top 3 (Habit 3)
- [ ]  
- [ ]  
- [ ]  

## Notities
-  `,
      habit: 3,
      quadrant: "II",
      tags: ["daily"],
    };
  },
};

function getIsoWeekLabel() {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function loadNotes(): Note[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as Note[] : []; }
  catch { return []; }
}
function saveNotes(notes: Note[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* ignore */ } }

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [q, setQ] = useState("");
  const [habit, setHabit] = useState<"all"|`${HabitId}`>("all");
  const [quad, setQuad] = useState<"all"|Quadrant>("all");
  const [selected, setSelected] = useState<string|null>(null);

  useEffect(() => {
    fetchNotes().then(setNotes).catch(() => { /* ignore errors */ });
  }, []);

  useEffect(()=>saveNotes(notes), [notes]);

  const current = notes.find(n => n.id === selected) ?? null;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return notes
      .filter(n => habit === "all" ? true : n.habit === Number(habit) as HabitId)
      .filter(n => quad === "all"   ? true : n.quadrant === quad)
      .filter(n => s ? (
        n.title.toLowerCase().includes(s) ||
        n.content.toLowerCase().includes(s) ||
        n.tags.some(t => t.toLowerCase().includes(s))
      ) : true)
      .sort((a,b) => b.updatedAt - a.updatedAt);
  }, [notes, habit, quad, q]);

  function createNote(kind: keyof typeof templates = "meeting") {
    const now = Date.now();
    const id = crypto.randomUUID();
    const base = templates[kind]();
    const newNote: Note = { id, ...base, createdAt: now, updatedAt: now };
    setNotes(xs => [newNote, ...xs]);
    setSelected(id);
    apiCreateNote(base).catch(() => { /* ignore errors */ });
  }

  function update(patch: Partial<Note>) {
    if (!current) return;
    setNotes(xs => xs.map(n => n.id === current.id ? { ...n, ...patch, updatedAt: Date.now() } : n));
  }

  function remove(id: string) {
    setNotes(xs => xs.filter(n => n.id !== id));
    if (selected === id) setSelected(null);
  }

  function duplicate(id: string) {
    const base = notes.find(n => n.id === id);
    if (!base) return;
    const copy: Note = { ...base, id: crypto.randomUUID(), title: base.title + " (kopie)", createdAt: Date.now(), updatedAt: Date.now() };
    setNotes(xs => [copy, ...xs]);
    setSelected(copy.id);
  }

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 -z-10 opacity-20"
           style={{backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,.25) 1px, transparent 1px)", backgroundSize:"24px 24px"}}/>

      {/* Top bar */}
      <header className="sticky top-0 backdrop-blur-xl bg-white/5 border-b border-white/10 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-100">
            <Rocket size={18} className="text-teal-300" />
            <span className="font-semibold tracking-wide">HabitFlow</span>
            <span className="text-xs text-slate-400">Tesla glass edition</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Zoek notities…"
                     className="pl-9 pr-3 py-2 w-64 rounded-xl bg-white/10 border border-white/10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40"/>
            </div>
            <button className="px-3 py-2 rounded-xl bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30 text-teal-200 text-sm flex items-center gap-2"
                    onClick={()=>createNote("meeting")}>
              <FiPlus/> Nieuwe notitie
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-12 gap-4 text-slate-100">
        {/* Sidebar */}
        <aside className="col-span-4 lg:col-span-3 rounded-2xl p-3 backdrop-blur-xl bg-white/5 border border-white/10">
          <div className="grid grid-cols-2 gap-2">
            <select className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm"
                    value={habit} onChange={(e)=>setHabit(e.target.value as `${HabitId}` | "all")}>
              <option value="all">Alle Habits</option>
              {HABITS.map(h=> <option key={h.id} value={h.id}>{`H${h.id} — ${h.name}`}</option>)}
            </select>
            <select className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm"
                    value={quad} onChange={(e)=>setQuad(e.target.value as Quadrant | "all")}>
              <option value="all">Alle Quadrants</option>
              {QUADRANTS.map(q=> <option key={q.id} value={q.id}>{`Q${q.id} — ${q.label}`}</option>)}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <GlassButton onClick={()=>createNote("meeting")} icon={<BookOpen size={16}/>}>Meeting</GlassButton>
            <GlassButton onClick={()=>createNote("weekly")}  icon={<Target size={16}/>}>Weekly</GlassButton>
            <GlassButton onClick={()=>createNote("daily")}   icon={<Timer size={16}/>}>Daily</GlassButton>
          </div>

          <div className="mt-3 h-[64vh] overflow-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-sm text-slate-400 p-2">Geen notities…</div>
            ) : filtered.map(n => (
              <button key={n.id} onClick={()=>setSelected(n.id)}
                className={cls("w-full text-left p-3 mb-2 rounded-xl border transition",
                               selected===n.id ? "bg-teal-500/10 border-teal-300/30" : "bg-white/5 border-white/10 hover:bg-white/10")}>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium truncate">{n.title}</div>
                  <div className="text-[10px] text-slate-400 whitespace-nowrap">{new Date(n.updatedAt).toLocaleString()}</div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
                  <Pill>H{n.habit}</Pill>
                  <Pill>Q{n.quadrant}</Pill>
                  {n.tags.slice(0,3).map(t => <Pill key={t}>#{t}</Pill>)}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <section className="col-span-8 lg:col-span-9 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 min-h-[74vh] flex flex-col">
          {!current ? (
            <div className="m-auto text-center p-10">
              <Sparkles className="mx-auto mb-3 text-teal-300"/>
              <h2 className="text-xl font-semibold">Welkom bij HabitFlow</h2>
              <p className="text-slate-400 mt-1">Maak een notitie of start met een template (Meeting, Weekly, Daily).</p>
            </div>
          ) : (
            <div className="flex-1 grid grid-rows-[auto_1fr_auto]">
              <div className="p-3 border-b border-white/10 flex items-center gap-2">
                <input className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm"
                       value={current.title} onChange={(e)=>update({title:e.target.value})}/>
                <select className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm"
                        value={current.habit} onChange={(e)=>update({habit:Number(e.target.value) as HabitId})}>
                  {HABITS.map(h=> <option key={h.id} value={h.id}>{`H${h.id} — ${h.name}`}</option>)}
                </select>
                <select className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm"
                        value={current.quadrant} onChange={(e)=>update({quadrant:e.target.value as Quadrant})}>
                  {QUADRANTS.map(q=> <option key={q.id} value={q.id}>{`Q${q.id} — ${q.label}`}</option>)}
                </select>
                <GlassButton onClick={()=>duplicate(current.id)} icon={<FiCopy/>}>Dupliceren</GlassButton>
                <GlassButton onClick={()=>remove(current.id)} icon={<FiTrash2/>} tone="danger">Verwijderen</GlassButton>
              </div>

              <textarea className="w-full h-full p-4 bg-transparent outline-none text-sm leading-6 placeholder:text-slate-500"
                        value={current.content} onChange={(e)=>update({content:e.target.value})}
                        placeholder="Schrijf hier…"/>

              <div className="p-3 border-t border-white/10 flex items-center justify-between text-slate-300">
                <TagEditor tags={current.tags} onChange={(tags)=>update({tags})}/>
                <div className="text-[11px]">
                  <span className="mr-3 inline-flex items-center gap-1"><FiClock/> Aangemaakt: {new Date(current.createdAt).toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1"><FiCheck/> Laatst bewerkt: {new Date(current.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GlassButton(
  { children, onClick, icon, tone }:
  { children: React.ReactNode; onClick: ()=>void; icon?: React.ReactNode; tone?: "danger" | "default"; }
) {
  return (
    <button onClick={onClick} className={cls(
      "px-3 py-2 rounded-xl text-sm inline-flex items-center gap-2 border transition",
      tone === "danger"
        ? "bg-red-500/10 hover:bg-red-500/20 border-red-400/30 text-red-200"
        : "bg-white/10 hover:bg-white/20 border-white/15 text-slate-100"
    )}>{icon}{children}</button>
  );
}

function Pill({ children }: {children: React.ReactNode}) {
  return <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[11px]">{children}</span>;
}

function TagEditor(
  { tags, onChange }: { tags: string[]; onChange: (next: string[])=>void; }
) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (tags.includes(t)) { setDraft(""); return; }
    onChange([...tags, t]); setDraft("");
  };
  const remove = (t: string) => onChange(tags.filter(x => x !== t));

  return (
    <div className="flex items-center gap-2">
      <Tags size={16} className="text-teal-300"/>
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map(t => (
          <span key={t} className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-xs flex items-center gap-1">
            #{t}
            <button className="hover:text-white/80" onClick={()=>remove(t)}>×</button>
          </span>
        ))}
      </div>
      <input value={draft} onChange={(e)=>setDraft(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && add()}
             placeholder="tag toevoegen…" className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs placeholder:text-slate-500"/>
      <GlassButton onClick={add} icon={<Sparkles size={14}/>}>Toevoegen</GlassButton>
    </div>
  );
}
