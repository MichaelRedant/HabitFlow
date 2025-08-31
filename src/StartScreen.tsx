// src/StartScreen.tsx
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Rocket, Grid3X3, BookOpen, Sparkles } from "lucide-react";

type Props = { onStart: () => void };

export default function StartScreen({ onStart }: Props) {
  const [skip, setSkip] = useState<boolean>(false);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") start();
      if (e.key.toLowerCase() === "m") intent("matrix");
      if (e.key.toLowerCase() === "n") intent("new_note");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    if (skip) localStorage.setItem("hf.skipWelcome", "1");
    onStart();
  }
  function intent(name: "matrix" | "new_note") {
    localStorage.setItem("hf.intent", name);
    start();
  }

  return (
    <div className="fixed inset-0 isolate flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 overflow-hidden">
      {/* Subtiele grid */}
      <div
        className="absolute inset-0 opacity-25 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-teal-400/20 via-cyan-400/10 to-fuchsia-400/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-indigo-400/20 via-sky-400/10 to-emerald-400/10 blur-3xl animate-pulse" />

      {/* Card + glow-border */}
      <div className="relative z-10">
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-white/30 via-cyan-300/30 to-transparent blur opacity-70" />
        <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,.35)] p-8 w-[min(92vw,720px)]">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Rocket size={18} className="text-teal-300" />
            <span className="uppercase tracking-[.2em] text-[12px] text-teal-200/80">
              Xinudesign edition
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
            HabitFlow
          </h1>
          <p className="mt-2 text-center text-slate-300">
            Covey’s <span className="font-medium">7 Habits</span> als{" "}
            <span className="font-medium">notes</span> &{" "}
            <span className="font-medium">task matrix</span> in één strakke app.
          </p>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={start}
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 border border-teal-300/30 bg-teal-400/15 hover:bg-teal-400/25 text-teal-100 transition"
              aria-label="Start"
            >
              Start <FiArrowRight className="transition -translate-x-0 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => intent("new_note")}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 border border-white/15 bg-white/10 hover:bg-white/20 transition"
            >
              <BookOpen size={16} /> Nieuwe notitie
            </button>
            <button
              onClick={() => intent("matrix")}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 border border-white/15 bg-white/10 hover:bg-white/20 transition"
            >
              <Grid3X3 size={16} /> Open matrix
            </button>
          </div>

          {/* Shortcuts & toggle */}
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div>
              Sneltoetsen: <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">Enter</kbd>{" "}
              Start · <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">N</kbd>{" "}
              Notitie · <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20">M</kbd> Matrix
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skip}
                onChange={(e) => setSkip(e.target.checked)}
                className="accent-teal-400"
              />
              Niet meer tonen
            </label>
          </div>

          {/* Habits chips */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-[12px]">
            {[
              "H1 • Be Proactive",
              "H2 • End in Mind",
              "H3 • First Things First",
              "H4 • Think Win-Win",
              "H5 • Seek to Understand",
              "H6 • Synergize",
              "H7 • Sharpen the Saw",
              "QII • Big Rocks",
            ].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white/10 border border-white/15 text-slate-200"
              >
                <Sparkles size={14} className="text-teal-300" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle bottom shadow */}
        <div className="mx-auto mt-6 h-6 w-64 rounded-full bg-black/40 blur-2xl opacity-60" />
      </div>
    </div>
  );
}
