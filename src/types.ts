export type HabitId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Quadrant = 'I' | 'II' | 'III' | 'IV';

export type NoteBase = {
  title: string;
  content?: string;
  habit?: HabitId | null;
  quadrant?: Quadrant | null;
  tags: string[];
};

export type Note = NoteBase & {
  id: number; // MySQL AUTO_INCREMENT
  createdAt: string | number;
  updatedAt: string | number;
};

export type TaskStatus = 'todo' | 'doing' | 'done' | 'blocked' | 'archived';

export type TaskBase = {
  title: string;
  description?: string;
  habit?: HabitId | null;
  importance: number;  // 1..5
  urgency: number;     // 1..5
  quadrant: Quadrant;
  status: TaskStatus;
  dueAt?: string | null;
  completedAt?: string | null;
  tags: string[];
  noteId?: number | null;
};

export type Task = TaskBase & {
  id: number;
  createdAt: string | number;
  updatedAt: string | number;
};
