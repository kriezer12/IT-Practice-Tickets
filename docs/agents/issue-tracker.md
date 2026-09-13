# Issue tracker and delivery workflow

GitHub is the canonical issue tracker and source repository for `kriezer12/IT-Practice-Tickets`. Local Markdown is supporting context, not a replacement for GitHub issues and pull requests.

The release parent is GitHub issue #1 and remains open until the complete product and production handoff are finished. The implementation issues are delivered in dependency order:

1. #2 — guided practice loop and repository workflow
2. #3 — evidence visuals and reviewed content
3. #4 — KO responsive accessible interface
4. #5 — session recovery and repeat practice
5. #6 — Vercel delivery and production verification

Each issue is implemented on one isolated feature branch, reviewed in one pull request, and merged into `main` only after the relevant checks pass. The implementation worker must not modify `main`; the parent workflow coordinates publication, review, merge, and deployment. Local orchestration drafts under `.superpowers/` are ignored and must not be required for a fresh checkout.

See the repository [agent guidance](../../AGENTS.md), [KO Design System](../../design.md), and [domain guide](domain.md) for related conventions.

## Local Markdown conventions

Issues and specs that need local supporting context live under `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or issue number directly.
