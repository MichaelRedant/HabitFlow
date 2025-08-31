export async function aiSummarize(noteId: number) {
  const r = await fetch("/api/ai/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ noteId }),
  });
  return r.json() as Promise<{
    summary: string;
    suggestedTags: string[];
    habit: number | null;
    quadrant: "I" | "II" | "III" | "IV" | null;
    actionItems: Array<{
      title: string; owner: string | null; due: string | null;
      quadrant: "I" | "II" | "III" | "IV"; habit: number | null; tags: string[];
    }>;
  }>;
}

export async function aiClassify(text: string) {
  const r = await fetch("/api/ai/classify", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return r.json() as Promise<{
    habit: number | null;
    quadrant: "I" | "II" | "III" | "IV" | null;
    suggestedTags: string[];
  }>;
}

export async function aiSearch(q: string) {
  const r = await fetch(`/api/ai/search?q=${encodeURIComponent(q)}`);
  return r.json() as Promise<Array<{ id: number; title: string; score: number }>>;
}
