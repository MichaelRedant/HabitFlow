export type Quadrant = "I" | "II" | "III" | "IV";
export type HabitId = 1|2|3|4|5|6|7;

export type Note = {
  id: string;
  title: string;
  content: string;
  habit: HabitId;
  quadrant: Quadrant;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};
