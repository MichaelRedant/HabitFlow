import type { Quadrant } from './types';

export const QUADRANT_PRESET: Record<Quadrant, { importance: number; urgency: number }> = {
  I: { importance: 5, urgency: 5 },
  II: { importance: 5, urgency: 2 },
  III: { importance: 2, urgency: 5 },
  IV: { importance: 2, urgency: 2 },
};
