import { FiCalendar, FiFileText, FiArrowRight, FiGrid } from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

export default function HomePage({ onSelect }: { onSelect: (view: 'tasks' | 'planner' | 'notes') => void }) {
  return (
    <div className="p-8">
      <section className="max-w-3xl mx-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Welkom terug!</h1>
        <p className="text-slate-300 mb-6 flex items-center gap-2">
          <Sparkles className="text-teal-300" size={16} /> Klaar om productief te zijn?
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => onSelect('tasks')}
            className="group flex items-center justify-between rounded-xl px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 transition"
          >
            <span className="inline-flex items-center gap-2"><FiGrid /> Task matrix</span>
            <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => onSelect('planner')}
            className="group flex items-center justify-between rounded-xl px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 transition"
          >
            <span className="inline-flex items-center gap-2"><FiCalendar /> Planner</span>
            <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => onSelect('notes')}
            className="group flex items-center justify-between rounded-xl px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 transition"
          >
            <span className="inline-flex items-center gap-2"><FiFileText /> Notities</span>
            <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>
    </div>
  );
}
