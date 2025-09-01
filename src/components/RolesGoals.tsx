import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import type { Goal, Role } from '../models';
import { isoWeekLabel } from '../utils/date';
import GlassCard from './GlassCard';

export default function RolesGoals() {
  const { state, setState } = usePlanner();
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const week = isoWeekLabel();

  const addRole = () => {
    if (!roleTitle.trim()) return;
    const newRole: Role = {
      id: Date.now().toString(),
      title: roleTitle.trim(),
      description: roleDesc.trim(),
    };
    setState((s) => ({ ...s, roles: [...s.roles, newRole] }));
    setRoleTitle('');
    setRoleDesc('');
  };

  const addGoal = (roleId: string, text: string) => {
    if (!text.trim()) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      roleId,
      week,
      description: text.trim(),
    };
    setState((s) => ({ ...s, goals: [...s.goals, newGoal] }));
  };

  return (
    <div className="space-y-4" aria-label="rollen en doelen">
      <h2 className="text-xl font-semibold">Weekkompas</h2>
      <p className="text-sm text-slate-400">
        Beschrijf je verschillende rollen (ouder, collega, vriend ...) en koppel er
        een doel aan voor deze week.
      </p>

      <GlassCard className="space-y-2 p-3">
        <input
          type="text"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Rol titel, bv. Ouder"
          className="bg-transparent border p-1 w-full rounded"
          aria-label="titel nieuwe rol"
        />
        <input
          type="text"
          value={roleDesc}
          onChange={(e) => setRoleDesc(e.target.value)}
          placeholder="Korte beschrijving"
          className="bg-transparent border p-1 w-full rounded"
          aria-label="beschrijving nieuwe rol"
        />
        <button
          onClick={addRole}
          className="bg-blue-600 text-white px-2 py-1 rounded"
        >
          Voeg rol toe
        </button>
      </GlassCard>
      <div className="space-y-4">
        {state.roles.map((role) => (
          <RoleCard key={role.id} role={role} week={week} onAddGoal={addGoal} />
        ))}
      </div>
    </div>
  );
}

function RoleCard({ role, week, onAddGoal }: { role: Role; week: string; onAddGoal: (roleId: string, text: string) => void }) {
  const { state } = usePlanner();
  const goals = state.goals.filter((g) => g.roleId === role.id && g.week === week);
  const [text, setText] = useState('');
  return (
    <GlassCard className="p-3" aria-label={`rol ${role.title}`}>
      <h3 className="font-medium">{role.title}</h3>
      <p className="text-sm text-slate-400">{role.description}</p>

      <ul className="list-disc ml-5 mt-2">
        {goals.map((g) => (
          <li key={g.id}>{g.description}</li>
        ))}
      </ul>
      <div className="flex mt-2 space-x-2">
        <input
          className="bg-transparent border p-1 flex-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Weekdoel, bv. 3x sporten"
          aria-label={`doel voor ${role.title}`}
        />
        <button
          className="bg-green-600 text-white px-2 py-1 rounded"
          onClick={() => {
            onAddGoal(role.id, text);
            setText('');
          }}
        >
          Voeg toe
        </button>
      </div>
    </GlassCard>
  );
}
