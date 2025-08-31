export function computeQuadrant({ importance = 3, urgency = 3, dueAt, habit, tags = [] }) {
  // "important" heuristiek
  const importantByScore = Number(importance) >= 4;
  const importantByTag   = (tags || []).some(t => ['goal','rock','q2'].includes(String(t).toLowerCase()));
  const importantByHabit = ['2','3','7'].includes(String(habit)); // End in Mind, First Things First, Sharpen

  const important = importantByScore || importantByTag || importantByHabit;

  // "urgent" heuristiek
  let urgent = Number(urgency) >= 4;
  if (dueAt) {
    const msLeft = new Date(dueAt).getTime() - Date.now();
    if (!isNaN(msLeft)) urgent = urgent || (msLeft <= 1000 * 60 * 60 * 48); // < 48u
  }

  if (urgent && important) return 'I';
  if (!urgent && important) return 'II';
  if (urgent && !important) return 'III';
  return 'IV';
}
