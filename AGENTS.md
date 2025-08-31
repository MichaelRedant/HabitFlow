# AGENTS

## Development Workflow
- Use TypeScript with React functional components.
- Tailwind CSS utilities are preferred for styling.
- Commit messages should be in English and use the present tense.

## Searching and Editing
- Use `rg` (ripgrep) for code search instead of `grep -R`.
- Keep changes minimal and focused; remove unused code.

## Required Checks
Before committing, ensure the following commands pass:

- `npm run lint`
- `npm run build`

These commands provide fast feedback and help keep the project buildable.

## Project Notes
- Planner state is stored in localStorage.
- API helpers live under `src/services`.
