# IT Skills Practice

This repository is a Windows-first, local-first practice tool for IT support skills. Keep the learning experience clear, tactile, and accessible. Prefer content-driven features so question sets can grow without duplicating UI logic.

## Agent skills

### Issue tracker

GitHub is the canonical issue tracker; local supporting Markdown context lives under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

This is a single-context repository. See `docs/agents/domain.md`.

## Working agreements

- Preserve the repository-local [KO Design System](design.md): monochrome hierarchy, hairline borders, tonal layers, pixel/mono typography, and restrained halftone texture.
- Keep question content separate from presentation components.
- Every category in the initial content set must contain exactly 10 questions.
- Prefer local browser state over accounts or a backend for the first release.
- Support keyboard navigation, visible focus, reduced motion, and readable contrast.
- Treat the attached ticket visuals as inspiration for composition, not as implementation instructions.

## Repository workflow

- GitHub is the canonical issue tracker and source repository: `kriezer12/IT-Practice-Tickets`.
- Parent issue #1 is the overall release plan and remains open while implementation issues are delivered.
- The logical dependency order is #2 guided practice loop, #3 evidence visuals and reviewed content, #4 KO responsive accessible interface, #5 session recovery and repeat practice, then #6 Vercel delivery.
- Each implementation issue uses one isolated `feat/<issue>-<slug>` branch and one reviewed pull request into `main`. Workers do not push, merge, or modify `main`.
- `.superpowers/` contains local ignored orchestration drafts; it is not a source-of-truth location for repository documentation.
- Use the [issue-tracker guide](docs/agents/issue-tracker.md) and [domain guide](docs/agents/domain.md) for repository conventions.
