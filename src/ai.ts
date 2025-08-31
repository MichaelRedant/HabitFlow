export interface ParsedTask {
  title: string;
  date?: string; // ISO datum yyyy-mm-dd
}

export async function analyzeNote(
  content: string
): Promise<{ summary: string; tasks: ParsedTask[] }> {
  const apiKey = (import.meta as { env: { VITE_OPENAI_API_KEY?: string } }).env
    .VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return { summary: content.slice(0, 100), tasks: [] };
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Vat notities samen in het Nederlands en extraheer taken met optionele datum (YYYY-MM-DD). Geef JSON: {"summary": string, "tasks": [{"title": string, "date": string?}]}',
          },
          { role: 'user', content },
        ],
        temperature: 0.2,
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content as string | undefined;
    if (!text) throw new Error('geen antwoord');
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const json = text.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(json);
    return {
      summary: parsed.summary ?? content.slice(0, 100),
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    };
  } catch {
    return { summary: content.slice(0, 100), tasks: [] };
  }
}
