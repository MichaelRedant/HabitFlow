/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { State } from './models';
import { defaultState } from './models';

interface PlannerContextType {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);
const STORAGE_KEY = 'covey_planner_state';

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<State>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as State) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  return (
    <PlannerContext.Provider value={{ state, setState }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
};
