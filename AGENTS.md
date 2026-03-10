# AGENTS.md

## 

## Scope

- Applies to this repository only.
- If this file conflicts with global rules, prefer this file for repo work.

## Core Rules

- No nonsense. To the point. Top quality work. Fast.
- UX has to be brilliant.
- Use multi agents where required.
- Default to parallel agent execution for independent tasks.
- Use a lead agent to merge, validate, and resolve conflicts.
- Maximize capability over cost and latency unless explicitly overridden.

## Working Rules

- Make focused, minimal changes.
- Do not modify unrelated files.
- NEVER DELETE FILES. If a file is unused or needs removal, MOVE it to `d:\donotpush\tobedeleted`.
- Keep code style consistent with existing patterns.
- Run relevant checks before finishing when possible.
- Prefer parallel reads, analysis, and validation when tasks are independent.
- Serialize only when one step depends on another.

## Preferred Commands

- Install: `npm install`
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

## Notes For Agents

- Ask before destructive actions (deletes, resets, force pushes).
- If requirements are unclear, state assumptions briefly and proceed.
- Keep one final owner for integration, consistency, and regression review.
