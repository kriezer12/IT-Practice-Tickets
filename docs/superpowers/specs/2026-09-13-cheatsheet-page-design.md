# IT Support Interview Cheatsheet — Page Design

**Date:** 2026-09-13  
**Status:** Approved direction for implementation  
**Source:** User-provided `IT Support / Technical Support Engineer — Interview Cheatsheet`

## Outcome

Add a local-first `/cheatsheet` page that turns the supplied interview notes into a fast, readable field manual. It should help a candidate rehearse troubleshooting language, refresh technical fundamentals, and jump directly to a topic during interview preparation.

## Chosen approach

Use a single document page with a compact hero, a visible topic index, and seven ordered content sections. On wide screens, the topic index is a sticky left rail and the content is a readable right column. On narrow screens, the rail becomes a horizontally scrollable but keyboard-accessible topic strip above the document. Sections remain visible in the DOM rather than hidden behind tabs or accordions so browser find, screen readers, printing, and keyboard review work predictably.

This is the best fit for the source: the material is reference content, not a multi-step practice interaction. The page keeps the repository's monochrome, tactile hierarchy while making the document easy to scan and revisit.

## Scope

### In scope

- A `/cheatsheet` route handled by the existing Vite SPA entry point.
- A header link between the practice library and the cheatsheet, plus a return-to-practice link on the cheatsheet.
- Theme toggle parity with the existing app.
- The seven supplied content areas:
  1. seven-step troubleshooting methodology;
  2. hardware/OS triage table;
  3. OSI model, networking concepts, common ports, and diagnostic commands;
  4. Active Directory and Windows Server fundamentals plus domain-login troubleshooting;
  5. security basics;
  6. customer-service prompts, STAR framing, and escalation guidance;
  7. quick-fire scenarios.
- A closing home-lab talking-point callout from the supplied notes.
- Semantic headings, landmarks, skip link, visible focus, touch-sized links, high-contrast tokens, responsive layout, and reduced-motion behavior.
- Content stored separately from the presentation component in a typed data module.
- Unit/component coverage for route selection, section rendering, topic links, and theme parity.

### Out of scope

- Accounts, remote content, search indexing, analytics, or a CMS.
- Editable notes, quiz scoring, progress tracking, or AI-generated interview answers.
- Rewriting the existing practice flow or changing the existing question catalog.
- Hiding content behind interaction-only controls.

## Information architecture

1. **Cheatsheet header** — shared IT Support Lab identity, local-session status, practice-library link, and theme toggle.
2. **Hero** — title, purpose statement, and a small metadata block describing the document.
3. **Topic index** — seven anchor links, each with a short label and ordinal.
4. **Document body** — troubleshooting loop feature panel followed by the remaining six sections.
5. **Closing callout** — concise reminder to use the user's hands-on AD lab as an interview differentiator.
6. **Footer** — existing local-first product language.

## Component and data boundaries

- **`Cheatsheet`** owns page composition, section anchors, focus behavior, and the theme/header/footer shell.
- **`src/data/cheatsheet.ts`** owns typed content arrays for the methodology steps, hardware rows, OSI layers, networking concepts, ports, commands, AD terms, security points, STAR prompts, quick-fire scenarios, and closing tip.
- Small presentational helpers inside `Cheatsheet` render repeated data shapes without moving source content into JSX.
- Existing `ThemeToggle` is reused. Existing library and practice content are not imported into the cheatsheet data module.
- `App` selects the cheatsheet when `window.location.pathname === '/cheatsheet'`; all other existing paths retain current library/practice behavior.

## Interaction and visual direction

- Extend the KO Design System tokens only as needed; use tonal surfaces, hairline borders, black/white inversion, Geist/Geist Pixel/Geist Mono, and restrained halftone texture.
- Use a bold editorial field-manual composition: large display title, compact mono metadata, oversized ordinals, and dense but generous content cards.
- Keep the topic rail sticky only at desktop widths; avoid sticky controls on small screens that consume reading space.
- Each topic link has a normal anchor fallback and a visible `:focus-visible` state. Headings use `scroll-margin-top` so anchored content is not obscured.
- Use tables only for genuinely tabular relationships (hardware triage and common ports); use lists for methodology, concepts, commands, and interview prompts.
- Add a print-friendly rule set that removes navigation-only decoration and preserves all source content.
- Use a restrained reveal on initial render only if it does not delay or hide content; disable it under `prefers-reduced-motion`.

## Content fidelity and safety

- Preserve the source's practical wording and command examples while correcting only presentation-level punctuation or capitalization where needed.
- Do not introduce unsupported claims, credentials, or personal experience beyond the supplied home-lab note.
- Display commands in readable monospace blocks and keep technical values selectable/copyable as ordinary text.
- Keep the page clearly educational; no external links or remote fetches are required for this page.

## Routing and failure behavior

- Vite's SPA fallback serves `/cheatsheet`; direct navigation resolves in the same client entry point.
- If a future content array is empty, render its heading and a concise unavailable message rather than throwing. Current source data is static and fully populated.
- The existing app's local progress and theme storage remain unchanged. Opening `/cheatsheet` must not mutate practice progress.

## Verification

- Test that `/cheatsheet` renders the cheatsheet heading, all seven section headings, topic links, and the practice-library return link.
- Test that the normal root path still renders the practice library and that the theme toggle remains available on both views.
- Test that the source data contains the expected counts for the seven-step method, hardware rows, OSI layers, common ports, diagnostic commands, security points, STAR prompts, and quick-fire scenarios.
- Run `npm run check`.
- Verify direct `/cheatsheet` navigation in a production preview, keyboard tab order/focus visibility, narrow layout, dark theme, and reduced-motion behavior.

## Acceptance criteria

- `/cheatsheet` is reachable from the main practice library and links back without losing local practice state.
- All seven source areas and the closing talking-point tip are represented in visible, scannable sections.
- Desktop and mobile layouts remain readable without horizontal page scrolling.
- Content is data-driven and the page remains usable with keyboard navigation, screen readers, and reduced motion.
- Existing practice tests and behavior remain green.
