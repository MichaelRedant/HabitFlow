# AGENTS

## Vision & Product North Star
HabitFlow is een futuristische, Tesla-2025 stijl notitie- en takenapp die Covey’s 7 Habits en de Eisenhower-matrix inzet voor focus. De app voelt zo snel en licht als Notepad/Apple Notes, maar met AI-assistentie voor samenvattingen, taakextractie en prioritering.

## Development Workflow
- **Stack:** React + TypeScript (Vite), Tailwind CSS, Express/Node, Sequelize + MySQL.
- **Components:** Functionele React components, hooks-first.
- **State:**  
  - Notes & Tasks: DB (MySQL) via backend API.  
  - Planner (dag/week/maand): **localStorage** voor snelle UX en offline-gevoel.
- **Styling:** Tailwind utilities; glassmorphism; neon-blauwe accenten; subtiele animaties (GPU-friendly).
- **Code style:** ESLint + TypeScript strict. Geen any’s zonder noodzaak.

## Searching and Editing
- Gebruik `rg` (ripgrep) voor searches.
- Keep diffs minimal: doelgericht refactoren, geen dode code.

## Commit Policy
- **English, present tense**.  
- Kleine units, beschrijvend:
  - `feat: add AI summarize endpoint`
  - `style: refine glass border radius`
  - `fix: prevent footer overflow in editor`

## Required Checks
Voor je commit/push:
- `npm run lint`
- `npm run build`
--
## UI/UX Style Guide (Tesla 2025)
- **Dark first**: `from-slate-950 via-slate-900 to-slate-800`.
- **Accenten:** teal/cyan neon, `backdrop-blur-xl`, glass borders `border-white/10–20`.
- **Motion:** korte transitions (150–250ms), `will-change: transform`, `translate/opacity` animaties.
- **Iconografie:** `lucide-react` + `react-icons`.
- **Terminologie (Vlaams):** Takenlijst, Weekplanner, Dagoverzicht, Notities, Herinneringen.

## AI Integration (OpenAI)
- **Server-side only** (nooit keys in client).  
- Responses API + Structured Outputs voor betrouwbare JSON.
- Features:
  - Notitie → **samenvatting + actiepunten + habit/quadrant**.
  - Tekst → **classify** (habit/quadrant/tags).
  - **Semantische zoek** met embeddings (text-embedding-3-small) + cosine.

### API Contracts
- `POST /api/ai/summarize { noteId } -> { summary, actionItems[], habit?, quadrant?, suggestedTags[] }`
- `POST /api/ai/classify { text } -> { habit?, quadrant?, suggestedTags[] }`
- `GET /api/ai/search?q=... -> [{ id, title, score }]`

## Planner (Drag & Drop)
- Dag (timeline), Week (grid), Maand (calendar).  
- Drag-and-drop tussen views (dnd-kit – optioneel).  
- Auto-suggesties naar **QII** (“First Things First”), reminders voor QI.

## Project Notes
- Planner state in localStorage.
- API helpers in `src/services`.
- .env nooit committen; gebruik `backend/.env.example` + `.gitignore`.

## Definition of Done
- Lint & build slagen.
- Geen UI overflow; editor footer en knoppen blijven zichtbaar.
- Geen secrets in code/commit (pre-commit check aanbevolen).
