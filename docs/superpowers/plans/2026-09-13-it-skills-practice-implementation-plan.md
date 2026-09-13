# IT Skills Practice — Implementation Plan

## 1. Project shell

- Create a Vite + React + TypeScript application with a minimal dependency surface.
- Add strict type checking, Vitest tests, ESLint, and a single `check` command.
- Keep the brainstorm session files ignored from Git.

## 2. Content and domain seams

- Define `CategoryId`, `PracticeQuestion`, and progress types.
- Author 10 practical cases each for Active Directory, Networking, and Physical Troubleshooting.
- Add a catalog validator that fails on missing categories, duplicate IDs, non-contiguous order, or any category count other than 10.

## 3. Practice experience

- Build the category library with local completion counts.
- Build the guided case shell: ticket, checkpoint choices, evidence, answer, takeaway, and question navigation.
- Add local progress persistence with malformed-state fallback and category reset.
- Add light/dark theme switching and responsive accessible controls.

## 4. Verification

- Unit test the catalog invariant and progress store.
- Run typecheck, tests, lint, and production build.
- Run the local app and verify the library, a complete case transition, category counts, keyboard focus, and narrow layout.
