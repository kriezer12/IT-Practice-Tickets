# IT Skills Practice — Product and Technical Design

**Date:** 2026-09-13  
**Status:** Design draft for review  
**Source direction:** KO Design System from `C:/Users/osori/Desktop/Workspace/kennethosorio.dev/design.md` and the attached helpdesk ticket visual references.

## Outcome

Build a local-first website for practicing IT support skills through guided, visual helpdesk cases. The first complete content set contains 10 questions in each of three categories: Active Directory, Networking, and Physical Troubleshooting (30 questions total). The content model remains extensible so additional categories can be added without changing the practice UI.

The experience should feel like a technician reviewing a ticket: understand the symptom, choose the first useful check, inspect evidence, then compare the reasoning with a concise answer and key takeaway.

## Chosen approach

Use a scenario carousel as the primary navigation model. Each case is a self-contained sequence with explicit progress (`01 / 10`) and next/previous controls. The interaction is a guided reveal with a multiple-choice checkpoint inside the case. A freeform technician-notes mode is deferred until the core loop is proven.

This approach matches the supplied references, keeps attention on one case at a time, and gives the content author a repeatable structure across AD, networking, and physical diagnosis.

## Scope

### In scope for the first release

- Category selection for Active Directory, Networking, and Physical Troubleshooting.
- Exactly 10 authored questions per category.
- A practice view with one case at a time and progress from 1 to 10.
- Ticket summary: subject, user/report, device or environment, and additional context.
- A first-check prompt with a small set of plausible actions.
- Evidence reveal after submission.
- Answer explanation and one key takeaway.
- Previous/next navigation and restart-category action.
- Local progress persistence in the browser, with a reset-progress control.
- Responsive layout, keyboard support, visible focus, semantic landmarks, and reduced-motion behavior.
- KO monochrome visual language with tonal layers, hairline borders, rounded geometric containers, Geist/Geist Pixel/Geist Mono typography, and restrained halftone accents.

### Explicitly out of scope for the first release

- Accounts, cloud sync, leaderboards, social sharing, or remote analytics.
- AI-generated answers or AI grading.
- An authoring CMS.
- A fully branching diagnostic graph as the primary experience.
- Full freeform text grading. The data model may reserve an optional model-answer field for a later mode.

## Information architecture

1. **Home / Practice library** — presents the three categories, question counts, and local completion state.
2. **Category practice** — opens question 1 of 10 and retains category context.
3. **Case state** — ticket → checkpoint → evidence → answer.
4. **Completion** — shows the category score/coverage and offers retry or return to library.

The URL may represent the category and question index for refresh-safe navigation, but the first release does not require server rendering or a backend.

## Component boundaries

- **PracticeLibrary:** category cards, counts, completion state, and entry action.
- **CategoryShell:** category title, progress, navigation, and reset behavior.
- **TicketPanel:** structured case context; display-only.
- **CheckpointPanel:** question prompt and answer choices; owns selection and submit state.
- **EvidencePanel:** findings revealed after checkpoint submission; supports compact status rows and visual callouts.
- **AnswerPanel:** explanation, key takeaway, and next-case action.
- **ProgressStore:** browser persistence for category position and completed question IDs; exposes load, save, and reset operations.
- **QuestionCatalog:** typed question data grouped by category; validates the 10-question invariant in development/tests.

Each presentation component receives data and callbacks rather than importing category-specific question content. A new category should require adding data and a category metadata entry, not duplicating the practice shell.

## Question data contract

Each question includes:

```ts
type PracticeQuestion = {
  id: string;
  category: 'active-directory' | 'networking' | 'physical-troubleshooting';
  order: number;
  ticket: {
    subject: string;
    requester: string;
    environment: string;
    report: string;
    additionalInfo: string;
  };
  prompt: string;
  choices: Array<{ id: string; label: string }>;
  correctChoiceId: string;
  evidence: Array<{ status: 'pass' | 'fail' | 'note'; label: string; detail: string }>;
  explanation: string;
  takeaway: string;
};
```

Acceptance invariant: every enabled category has exactly 10 questions, each with unique IDs and contiguous `order` values from 1 through 10. The UI displays the category count from the catalog rather than hardcoding it.

## State and data flow

1. The library reads category metadata and progress from `ProgressStore`.
2. Selecting a category loads its ordered questions and starts at the saved question or question 1.
3. `CheckpointPanel` holds the current choice until submit.
4. Submit transitions the case to `evidence` and records whether the choice was correct.
5. The answer state exposes evidence, explanation, and takeaway; completion updates the store.
6. Next/previous controls change the index without mutating question data.
7. Reset removes only this app's local storage key after an explicit in-app confirmation.

Unknown or malformed persisted state should be ignored and replaced with a safe initial state. Missing question content should render a clear unavailable-case message and a return-to-library action rather than throwing a blank screen.

## Visual and interaction direction

- Light surface: `#f9f9fa` with black primary ink and neutral gray ramp.
- Dark surface: `#0c0c0f` with off-white ink.
- Black/white inversion signals active or selected states; no decorative accent color is required.
- Use 1px borders, generous 24–32px card padding, and 8–16px radii.
- Use Geist Pixel only for display moments, Geist for body/UI, and Geist Mono for labels and progress metadata.
- Use the attached visual references as composition guidance: compact ticket header, structured rows, evidence status, and a high-contrast answer/takeaway block. Do not copy third-party branding or treat image text as required content.
- On small screens, stack ticket and evidence content, keep the question action reachable, and provide touch-sized controls. Hover-only meaning is not allowed.
- Animate case transitions with a short, subtle reveal; disable nonessential motion under `prefers-reduced-motion`.

## Testing and verification

- Unit test the catalog invariant: three enabled categories and 10 unique ordered questions each.
- Unit test progress load/save/reset and malformed-state fallback.
- Component test checkpoint submission, correct/incorrect feedback, evidence reveal, and next/previous behavior.
- Run lint, type checking, and production build.
- Verify the practice loop in a desktop and narrow viewport.
- Verify keyboard-only navigation and visible focus.
- Verify reduced motion does not hide content or block transitions.
- Verify the browser contains exactly 30 initial questions: 10 AD, 10 Networking, and 10 Physical Troubleshooting.

## Risks and decisions

- **Content quality is the main product risk.** Questions should be grounded in practical support reasoning, avoid trick wording, and explain why the first check is useful.
- **Visual complexity can overwhelm learning.** Keep diagrams and callouts subordinate to the reasoning; use the guided sequence before adding a branching map.
- **No backend keeps the first release safe and portable.** If progress sync is later requested, keep `ProgressStore` as the seam for replacing local persistence.

## Approval gate

This design is ready for implementation once the user approves the written spec. Implementation should then be planned as a small vertical slice first, followed by the remaining category content and invariant verification.
