import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { usePlanner } from '../PlannerContext';
import type { Task } from '../models';


const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];


export default function WeeklyPlanner() {
  const { state, setState } = usePlanner();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'rock' | 'sand'>('rock');

  const [day, setDay] = useState('Ma');

  const [time, setTime] = useState('09:00');

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      day,
      time,
    };
    setState((s) => ({ ...s, tasks: [...s.tasks, newTask] }));
    setTitle('');
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const destDay = result.destination.droppableId;
    const taskId = result.draggableId;
    setState((s) => {
      const tasks = s.tasks.map((t) =>
        t.id === taskId ? { ...t, day: destDay } : t
      );
      return { ...s, tasks };
    });
  };

  const tasksByDay = (day: string) =>
    state.tasks
      .filter((t) => t.day === day)
      .sort((a, b) => (a.type === b.type ? a.time.localeCompare(b.time) : a.type === 'rock' ? -1 : 1));

  return (

    <div aria-label="weekplanner" className="space-y-4">
      <h2 className="text-xl font-semibold">Weekplanner</h2>

      <div className="flex space-x-2">
        <input
          className="border p-1 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}

          placeholder="Taak"
          aria-label="taak titel"

        />
        <select
          className="border p-1"
          value={type}
          onChange={(e) => setType(e.target.value as 'rock' | 'sand')}

          aria-label="taak type"
        >
          <option value="rock">Grote Steen</option>
          <option value="sand">Zand</option>

        </select>
        <select
          className="border p-1"
          value={day}
          onChange={(e) => setDay(e.target.value)}

          aria-label="taak dag"

        >
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="time"
          className="border p-1"
          value={time}
          onChange={(e) => setTime(e.target.value)}

          aria-label="taak tijd"
        />
        <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={addTask}>
          Voeg toe

        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <Droppable droppableId={d} key={d}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}

                  className="min-h-[200px] border rounded p-1 bg-white/5"

                >
                  <h3 className="text-center font-medium mb-1">{d}</h3>
                  {tasksByDay(d).map((t, idx) => (
                    <Draggable key={t.id} draggableId={t.id} index={idx}>
                      {(drag) => (
                        <div
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          {...drag.dragHandleProps}

                          className={`p-1 mb-1 rounded text-sm text-white transition-transform duration-200 ${t.type === 'rock' ? 'bg-blue-600' : 'bg-gray-500'} hover:scale-105`}

                        >
                          {t.time} {t.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
