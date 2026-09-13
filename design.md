---
name: KO Design System
---

# KO Design System

This repository uses a high-resolution minimalist visual language for technical work. Information hierarchy comes from typography, spacing, tonal surfaces, and inversion instead of decorative color. The practice interface should feel precise, calm, and tactile.

## Color tokens

Use a monochrome semantic palette:

- Light surface: `#f9f9fa`; dark surface: `#0c0c0f`.
- Primary ink: `#1a1c1d` in light mode and `#f4f4f5` in dark mode.
- Secondary text uses neutral gray; hairlines use a low-contrast gray such as `#d4d4d8` in light mode and `#3f3f46` in dark mode.
- Use inversion for active, selected, and high-priority states. Do not make red/green the only way to understand a result.

## Typography

- Use Geist Pixel for high-impact display headings when the local asset is available.
- Use Geist for body copy and interface text.
- Use Geist Mono for labels, progress metadata, IDs, and technical values.
- Do not fetch fonts remotely in the first release; use installed Geist families when available, then local/system fallbacks.
- Small labels are uppercase, compact, and widely tracked. Body text remains readable with comfortable line height.

## Layout and shape

- Align spacing to a 4px rhythm, with 16px mobile margins, 24px gutters, and 48px desktop margins.
- Separate panels with 1px hairline borders and tonal layers rather than heavy shadows.
- Use 8px radii for controls, 12px for cards, and 16px for feature containers.
- Preserve generous padding in information-dense panels and keep mobile layouts legible without horizontal scrolling.

## Interaction and texture

- Buttons and cards need visible keyboard focus, touch-sized targets, and a non-hover path to every meaning.
- Use restrained halftone dot fields only as quiet structural texture; never let them compete with ticket evidence or answer text.
- Motion should clarify state changes and must be reduced or removed under `prefers-reduced-motion` without hiding content.
- Ticket diagrams and status marks must have text equivalents. Semantic status must remain understandable from labels and copy, not color alone.

## Content composition

Keep question content in the catalog and pass it into presentation components as data. A category card can establish orientation, but the guided case should foreground the ticket, the first-check decision, revealed evidence, and the explanation of why that check has the highest signal.
