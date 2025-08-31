import { useState } from 'react';
import MissionValues from './components/MissionValues';
import RolesGoals from './components/RolesGoals';
import WeeklyPlanner from './components/WeeklyPlanner';
import DailyPage from './components/DailyPage';
import Notes from './components/Notes';
import SharpenSaw from './components/SharpenSaw';
import Reflection from './components/Reflection';

export default function App() {
  const [page, setPage] = useState<'planner' | 'daily' | 'compass' | 'notes' | 'renewal' | 'reflection'>('planner');

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4 overflow-y-auto" aria-label="sidebar">
        <MissionValues />
        <nav className="mt-4 space-y-1">
          <NavButton label="Weekly Planner" active={page === 'planner'} onClick={() => setPage('planner')} />
          <NavButton label="Daily Page" active={page === 'daily'} onClick={() => setPage('daily')} />
          <NavButton label="Weekly Compass" active={page === 'compass'} onClick={() => setPage('compass')} />
          <NavButton label="Notes" active={page === 'notes'} onClick={() => setPage('notes')} />
          <NavButton label="Sharpen the Saw" active={page === 'renewal'} onClick={() => setPage('renewal')} />
          <NavButton label="Reflection" active={page === 'reflection'} onClick={() => setPage('reflection')} />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4" aria-label="main content">
        {page === 'planner' && <WeeklyPlanner />}
        {page === 'daily' && <DailyPage />}
        {page === 'compass' && <RolesGoals />}
        {page === 'notes' && <Notes />}
        {page === 'renewal' && <SharpenSaw />}
        {page === 'reflection' && <Reflection />}
      </main>
    </div>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-2 py-1 rounded ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
    >
      {label}
    </button>
  );
}
