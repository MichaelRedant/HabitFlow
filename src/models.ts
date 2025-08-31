export interface User {
  id: string;
  name: string;
  mission: string;
  values: string;
}

export interface Role {
  id: string;
  title: string;
  description: string;
}

export interface Goal {
  id: string;
  roleId: string;
  week: string; // e.g. 2025-W35
  description: string;
}

export interface Note {
  id: string;
  content: string;
  summary: string;
  date: string; // ISO datum yyyy-mm-dd
  tags: string[];
  linkedGoalId?: string;
  linkedWeek?: string; // week label
  urgent: boolean;
  important: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: 'rock' | 'sand';
  day: string; // date string
  time: string; // HH:MM
  linkedGoalId?: string;
}

export interface Reflection {
  id: string;
  week: string;
  weekly: string;
  monthly?: string;
}

export interface Renewal {
  id: string;
  week: string;
  physical: boolean;
  mental: boolean;
  emotional: boolean;
  spiritual: boolean;
}

export interface State {
  user: User;
  roles: Role[];
  goals: Goal[];
  notes: Note[];
  tasks: Task[];
  reflections: Reflection[];
  renewals: Renewal[];
}

export const defaultState: State = {
  user: { id: '1', name: 'User', mission: '', values: '' },
  roles: [],
  goals: [],
  notes: [],
  tasks: [],
  reflections: [],
  renewals: [],
};
