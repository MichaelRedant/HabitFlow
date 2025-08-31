# HabitFlow

HabitFlow is een **React + TypeScript** app (Vite) met een **Tesla-2025 look**: glassmorphism, neon-blauwe accenten en soepele animaties. Ze combineert snelle notities met **AI-assistentie** en een **Eisenhower-matrix** in de geest van **Covey’s 7 Habits**.

## ✨ Features

- **Notities**: eenvoudige editor (markdown-friendly), auto-save, zoeken, tags.
- **AI-integratie**:
  - Detecteert **acties** in vrije tekst.
  - Classificeert in **Habit (1–7)** en **Quadrant (I–IV)**.
  - Genereert **samenvattingen** en **prioriteringstips** (“Begin with the end in mind”, “Put first things first”).
- **Planner**:
  - **Dag**: timeline met tijdslots.
  - **Week**: grid per rol/doel.
  - **Maand**: kalenderoverzicht.
  - Drag-and-drop tussen views (optioneel via dnd-kit).
- **Matrix**: visuele Eisenhower-matrix met hover-interacties.
- **Missie & Waarden**: noteer je persoonlijke missie en kernwaarden met duidelijke hints.
- **Weekkompas & Reflectie**: rollen, doelen en "Zaag Scherpen" met heldere uitleg voor nieuwkomers.
- **Onboarding & Help**: interactieve gids voor nieuwe gebruikers, altijd opnieuw te starten.
- **Vlaams taalgebruik**: “Takenlijst”, “Weekplanner”, “Herinnering”.
- **Design**: Dark mode standaard, glass cards, subtiele vonken/aurora-achtergronden.

## 🧩 Tech Stack

- **Frontend:** React 19, Vite 7, TypeScript 5, Tailwind CSS 4, lucide-react.
- **Backend:** Node/Express, Sequelize, MySQL (Vimexx).
- **AI:** OpenAI Responses API (server-side), Embeddings voor zoek.
- **State:** Planner in `localStorage`, notities via API; UI-state met React hooks.

## 🚀 Getting Started

### 1) Clone & install
```bash
git clone https://github.com/MichaelRedant/HabitFlow.git
cd HabitFlow
npm install
```

### 2) Start development server

```bash
npm run dev
```
