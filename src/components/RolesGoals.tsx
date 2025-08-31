import { useState } from 'react';
import { usePlanner } from '../PlannerContext';
import type { Goal, Role } from '../models';

function isoWeekLabel(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

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
      <div className="space-y-2">
        <input
          type="text"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Rol titel"
          className="border p-1 w-full"
          aria-label="titel nieuwe rol"
        />
        <input
          type="text"
          value={roleDesc}
          onChange={(e) => setRoleDesc(e.target.value)}
          placeholder="Rol beschrijving"
          className="border p-1 w-full"
          aria-label="beschrijving nieuwe rol"
        />
        <button onClick={addRole} className="bg-blue-600 text-white px-2 py-1 rounded">
          Voeg rol toe
        </button>
      </div>
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
    <div className="border p-2 rounded" aria-label={`rol ${role.title}`}>
      <h3 className="font-medium">{role.title}</h3>
      <p className="text-sm text-gray-400">{role.description}</p>
      <ul className="list-disc ml-5 mt-2">
        {goals.map((g) => (
          <li key={g.id}>{g.description}</li>
        ))}
      </ul>
      <div className="flex mt-2 space-x-2">
        <input
          className="border p-1 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Weekdoel"
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
    </div>
  );
}
