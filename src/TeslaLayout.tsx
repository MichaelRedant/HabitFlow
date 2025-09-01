import { useState } from 'react';
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiGrid,
} from 'react-icons/fi';
import StartScreen from './StartScreen';
import TaskMatrix from './TaskMatrix';
import Planner from './Planner';
import App from './App';
import HomePage from './HomePage';
import Onboarding from './Onboarding';
import HelpPage from './HelpPage';
import GlassCard from './components/GlassCard';

const cls = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(' ');

export default function TeslaLayout() {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState<
    'home' | 'tasks' | 'planner' | 'notes' | 'profile' | 'help'
  >('home');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hf.onboarded'));

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
      <div className="flex h-screen text-slate-100">
        {/* Navigation bar */}
        <nav className="w-20 flex flex-col items-center py-6 bg-black/60 backdrop-blur-xl border-r border-white/10">
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
              <FiGrid />
            </button>
          </li>
          <li>
            <button
              className={cls(
                'p-3 rounded-xl transition',
                active === 'planner' ? 'bg-white/20 text-teal-300' : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => setActive('planner')}
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
        <main className="flex-1 relative overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {active === 'home' && <HomePage onSelect={setActive} />}
        {active === 'tasks' && <TaskMatrix />}
        {active === 'planner' && <Planner />}
        {active === 'notes' && <App />}

        {active === 'help' && (
          <HelpPage
            onRestartOnboarding={() => {
              localStorage.removeItem('hf.onboarded');
              setShowOnboarding(true);
            }}
          />
        )}

          {active === 'profile' && (
            <div className="p-8">
              <GlassCard className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-semibold mb-4">Profiel</h1>
                <p className="text-slate-300">Profielinformatie komt hier.</p>
              </GlassCard>
            </div>
          )}
      </main>
      {showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
    </div>
  );
}
