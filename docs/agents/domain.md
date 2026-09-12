# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists: it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, proceed silently. Don't flag their absence or suggest creating them upfront. The domain-modeling skill creates them lazily when terms or decisions actually get resolved.

## File structure

This is a single-context repository. Use a root `CONTEXT.md` and `docs/adr/` if domain documentation becomes necessary.

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in `CONTEXT.md`. If the concept is not defined yet, note the gap for domain modeling rather than inventing conflicting vocabulary.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding it.
