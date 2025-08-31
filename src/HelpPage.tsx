
export default function HelpPage({ onRestartOnboarding }: { onRestartOnboarding: () => void }) {

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
        <h2 className="text-xl font-semibold mt-6 mb-2">Missie & Waarden</h2>
        <p className="text-slate-300 mb-4">
          Bepaal je richting door je persoonlijke missie en kernwaarden in te vullen in de zijbalk.
        </p>

        <div className="flex flex-col items-start gap-4">
          <button
            onClick={onRestartOnboarding}
            className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-300/30"
            title="Start de rondleiding opnieuw"
          >
            Onboarding opnieuw starten
          </button>
          <p className="text-slate-400 text-sm">
            Deze app werd gemaakt door{' '}
            <a
              href="https://www.xinudesign.be"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Xinudesign
            </a>
            .
          </p>
          <p className="text-slate-300">Heb je vragen of feedback? Laat het ons weten!</p>
        </div>

      </section>
    </div>
  );
}
