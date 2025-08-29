import { useState } from 'react';
import { FiHome, FiCalendar, FiFileText, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi';
import StartScreen from './StartScreen';
import TaskMatrix from './TaskMatrix';
import App from './App';
import HomePage from './HomePage';
import Onboarding from './Onboarding';
import HelpPage from './HelpPage';

const cls = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ');

export default function TeslaLayout() {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<'home' | 'tasks' | 'notes' | 'profile' | 'help'>('home');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hf.onboarded'));

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="flex h-screen text-slate-100">
      {/* Navigation bar */}
      <nav className="w-20 flex flex-col items-center py-6 bg-black/80 backdrop-blur-xl border-r border-white/10">
        <div className="mb-8 text-red-500 text-2xl font-bold">⚡</div>

        <ul className="flex-1 flex flex-col gap-6 list-none">
          <li>
            <button
              className={cls(
                'p-3 rounded-xl transition',
                active === 'home' ? 'bg-white/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => setActive('home')}
            >
              <FiHome />
            </button>
          </li>
          <li>
            <button
              className={cls(
                'p-3 rounded-xl transition',
                active === 'tasks' ? 'bg-white/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => setActive('tasks')}
            >
              <FiCalendar />
            </button>
          </li>
          <li>
            <button
              className={cls(
                'p-3 rounded-xl transition',
                active === 'notes' ? 'bg-white/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => setActive('notes')}
            >
              <FiFileText />
            </button>
          </li>
          <li>
            <button
              className={cls(
                'p-3 rounded-xl transition',
                active === 'help' ? 'bg-white/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => setActive('help')}
            >
              <FiHelpCircle />
            </button>
          </li>
          <li>
            <button
              className={cls(
                'p-3 rounded-xl transition',
                active === 'profile' ? 'bg-white/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => setActive('profile')}
            >
              <FiUser />
            </button>
          </li>
        </ul>
        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
          <FiSettings />
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 relative overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        {active === 'home' && <HomePage onSelect={setActive} />}
        {active === 'tasks' && <TaskMatrix />}
        {active === 'notes' && <App />}
        {active === 'help' && <HelpPage />}
        {active === 'profile' && (
          <div className="p-8">
            <section className="max-w-3xl mx-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 shadow-lg">
              <h1 className="text-2xl font-semibold mb-4">Profiel</h1>
              <p className="text-slate-300">Profielinformatie komt hier.</p>
            </section>
          </div>
        )}
      </main>
      {showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
    </div>
  );
}
