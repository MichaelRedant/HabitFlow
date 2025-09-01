import { useState } from 'react';
import MissionValues from './components/MissionValues';
import RolesGoals from './components/RolesGoals';
import WeeklyPlanner from './components/WeeklyPlanner';
import DailyPage from './components/DailyPage';
import Agenda from './components/Agenda';
import Notes from './components/Notes';
import SharpenSaw from './components/SharpenSaw';
import Reflection from './components/Reflection';
import HelpPage from './HelpPage';
import Onboarding from './Onboarding';

export default function App() {
  const [page, setPage] = useState<
    | 'planner'
    | 'agenda'
    | 'daily'
    | 'compass'
    | 'notes'
    | 'renewal'
    | 'reflection'
    | 'help'
  >('planner');
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('hf.onboarded')
  );

  const restartOnboarding = () => {
    localStorage.removeItem('hf.onboarded');
    setShowOnboarding(true);
  };

  return (
    <>
      {showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
        <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-gray-100">
          <aside className="w-64 border-r border-white/10 bg-white/5 p-4 overflow-y-auto backdrop-blur-xl" aria-label="zijbalk">
          <MissionValues />
          <nav className="mt-4 space-y-1">
            <NavButton label="Weekplanner" active={page === 'planner'} onClick={() => setPage('planner')} />
            <NavButton label="Agenda" active={page === 'agenda'} onClick={() => setPage('agenda')} />
            <NavButton label="Dag" active={page === 'daily'} onClick={() => setPage('daily')} />
            <NavButton label="Weekkompas" active={page === 'compass'} onClick={() => setPage('compass')} />
            <NavButton label="Notities" active={page === 'notes'} onClick={() => setPage('notes')} />
            <NavButton label="Zaag Scherpen" active={page === 'renewal'} onClick={() => setPage('renewal')} />
            <NavButton label="Reflectie" active={page === 'reflection'} onClick={() => setPage('reflection')} />
            <NavButton label="Help" active={page === 'help'} onClick={() => setPage('help')} />
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 animate-fade-in" aria-label="hoofdinhoud">
          {page === 'planner' && <WeeklyPlanner />}
          {page === 'agenda' && <Agenda />}
          {page === 'daily' && <DailyPage />}
          {page === 'compass' && <RolesGoals />}
          {page === 'notes' && <Notes />}
          {page === 'renewal' && <SharpenSaw />}
          {page === 'reflection' && <Reflection />}
          {page === 'help' && <HelpPage onRestartOnboarding={restartOnboarding} />}
        </main>
      </div>
    </>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={`Ga naar ${label}`}
      className={`block w-full text-left px-2 py-1 rounded transition-transform duration-200 ${active ? 'bg-blue-600 text-white scale-105' : 'hover:bg-gray-700 hover:scale-105'}`}
    >
      {label}
    </button>
  );
}

