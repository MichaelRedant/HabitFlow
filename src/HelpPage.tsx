export default function HelpPage() {
  return (
    <div className="p-8">
      <section className="max-w-3xl mx-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Help & Uitleg</h1>
        <p className="text-slate-300 mb-4">
          HabitFlow helpt je de 7 Habits toe te passen in je dagelijkse planning. Hieronder vind je een korte uitleg.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Notities</h2>
        <p className="text-slate-300 mb-4">
          Maak notities per habit, voeg tags toe en houd je voortgang bij. Gebruik de templates voor een snelle start.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Task matrix</h2>
        <p className="text-slate-300 mb-4">
          Orden je taken volgens de Eisenhower-matrix. Focus op de quadranten die echt impact hebben.
        </p>
        <p className="text-slate-300">
          Heb je vragen of feedback? Laat het ons weten!
        </p>
      </section>
    </div>
  );
}
