import { useState } from 'react';
import { FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const steps = [
    {
      title: 'Welkom bij HabitFlow',
      body: 'Beheer je taken en notities volgens de 7 Habits. Laten we kort de belangrijkste onderdelen bekijken.'
    },
    {
      title: 'Notities maken',
      body: 'Leg je ideeën vast en organiseer ze per habit. Gebruik tags om alles snel terug te vinden.'
    },
    {
      title: 'Task matrix',
      body: 'Plan je dag met de Eisenhower-matrix en houd focus op wat er echt toe doet.'
    },
    {
      title: 'Hulp nodig?',
      body: 'Je kan deze rondleiding later opnieuw starten via de Help-pagina.'
    }
  ];
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
    } else {
      localStorage.setItem('hf.onboarded', '1');
      onFinish();
    }
  };
  const prev = () => setIndex(Math.max(index - 1, 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-8 w-[min(90vw,400px)] text-center">
        <h2 className="text-xl font-semibold mb-4">{steps[index].title}</h2>
        <p className="text-slate-300 mb-6">{steps[index].body}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            disabled={index === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border border-white/15 disabled:opacity-30"
          >
            <FiArrowLeft /> Vorige
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-300/30"
          >
            {index < steps.length - 1 ? (
              <>
                Volgende <FiArrowRight />
              </>
            ) : (
              <>
                Afronden <FiCheck />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
