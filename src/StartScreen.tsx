import { FiArrowRight } from 'react-icons/fi';

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="relative z-10 text-center p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl">
        <h1 className="text-4xl font-bold mb-4 tracking-wide">HabitFlow</h1>
        <p className="text-slate-300 mb-6">Welkom bij de Tesla 2025 ervaring.</p>
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 flex items-center gap-2 transition"
        >
          Start <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
