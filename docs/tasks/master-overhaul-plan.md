# Master Overhaul Plan

## Title
Supabase-first catalog, canonical routing, premium UX foundation, and advanced planning configurator overhaul.

## Summary
- Unify the previously separate workstreams into one master program:
  data-model cleanup, repo normalization, shared content/config extraction, shell and homepage polish, product and filter modernization, and an advanced customer-facing configurator.
- Treat the catalog and configurator as one connected system. Customers should move from discovery to planning to qualified enquiry without losing context.
- Keep Supabase as the primary source of truth and Nhost as a strict mirror for fallback continuity.
- Make the configurator materially more capable than the current repo state:
  guided planning flow, stronger recommendations, persistent planning outputs, better sales handoff, and premium UX on desktop and mobile.

## Locked Decisions
- Supabase remains the primary source of truth.
- Nhost remains a fallback mirror, not a second source of truth.
- Canonical product slugs use the `category-subcategory-name` model.
- Category and subcategory IDs become first-class stable identifiers.
- Shared business copy, planner copy, and route copy move into `data/site/*`.
- The design system stays in `app/globals.css` plus the existing Tailwind setup.
- One primary configurator experience is the target.
- The old stepper and legacy visual configurators are source material, not long-term parallel products.
- `.DONOTDELETE` stays local-only and must never be committed.

## Current-State Synthesis

### Repo and data
- The repo still has unfinished normalization work:
  docs move formalization, removal of tracked legacy paths, and cleanup of stale references.
- Canonical slug and ID migration is largely in place, but audit closure is incomplete:
  orphan-reference verification, uniqueness and index verification, and full alias coverage still need explicit closure.
- Nhost parity is mostly in place, but GraphQL limitations and documented fallback behavior still need to be treated as deliberate architecture, not incidental behavior.

### UX and content
- Shared shell and homepage foundations improved, but repeated visual formulas and scattered business copy still exist.
- Product pages and category filters work, but they still read more like catalog utilities than decision support or planning surfaces.
- Hardcoding verification found that active and legacy UI still carry repeated trust, CTA, and region strings in several places.

### Configurator
- The current `Simple2DConfigurator` already delivers valuable planning logic:
  fit check, seat or unit calculation, budget band, planning coverage, and structured enquiry output.
- The older configurator stack is better at staged guidance, preview framing, and summary presentation.
- Industry benchmarks indicate the target should combine:
  - HON-style configuration and quote/export readiness
  - Haworth-style planning confidence and modular workspace logic
  - Knoll-style planning framing and workplace strategy tone
  - MillerKnoll/Geiger-style immersive clarity and specification confidence

## Target Architecture

### 1. Repo and information architecture
- Normalize the repo so tracked source, tracked docs, and local-only archives are clearly separated.
- Repair stale script and documentation references after path cleanup.
- Keep one authoritative plan/checklist pair for execution control.

### 2. Canonical catalog model
- Canonical category IDs and canonical subcategory IDs drive routing, filtering, and product lookup.
- Legacy slugs remain aliases only.
- One shared helper layer governs category normalization, subcategory normalization, slug generation, route generation, and alias resolution.
- Runtime helpers emit canonical URLs by default.

### 3. Shared content and UX foundation
- Shared route copy, planner copy, CTA labels, and repeated trust/contact strings live in `data/site/*`.
- `app/globals.css` provides a semantic UI vocabulary for shells, cards, panels, proof elements, planner surfaces, and action blocks.
- Product pages, filters, and configurator use the same visual language instead of feeling like separate products.

### 4. One advanced planning configurator
- One unified configurator absorbs the best guidance patterns from the old stepper and the planning math from the current `Simple2DConfigurator`.
- The configurator becomes a premium planning surface, not a raw internal form.
- The experience must answer:
  - `Will this fit?`
  - `How many seats or units will this support?`
  - `What budget band should I expect?`
  - `Which system should I evaluate next?`

## Program Streams

## Program A: Repo normalization and docs coherence
- Formalize the docs move set and regrouped doc structure.
- Remove tracked legacy folders and files that should no longer live in the repo.
- Repair stale references to removed legacy paths and old docs locations.
- End with an intentional and understandable repo state.

## Program B: Supabase and Nhost closure
- Finish the remaining audit work for orphan references, uniqueness and index verification, alias coverage, and runtime expectations.
- Close canonical slug conflict cases and missing alias rows.
- Re-run Supabase and Nhost parity audits and document GraphQL versus SQL fallback behavior as deliberate design.
- Keep route compatibility stable during the transition.

## Program C: Shared helper and shared copy consolidation
- Keep one canonical route/category/slug helper layer.
- Move repeated site, trust, planner, CTA, and contact copy into `data/site/*`.
- Remove duplicate route maps, assistant prompt duplication, and shell-level string scatter.
- Keep only truly route-specific editorial copy inline.

## Program D: Premium shell and homepage finish
- Remove residual local visual formulas in active shell and homepage components.
- Keep shell, homepage, and planner surfaces aligned to one visual system.
- Re-check hardcoding after cleanup, including legacy but retained UI files.

## Program E: Product page planning overhaul
- Rebuild product detail pages around planning decisions, not only static product presentation.
- Above the fold, answer:
  what this is, what it is best for, what planning role it serves, and what the next action should be.
- Use a clear CTA hierarchy:
  primary `Plan this system` or `Request quote`,
  secondary compare or quote-cart actions.
- Differentiate configurable and non-configurable categories without creating fake configurability.
- Show related systems as planning alternatives rather than generic recommendations.

## Program F: Filter and category-page overhaul
- Refactor filters into smaller, buyer-facing UI parts.
- Keep API behavior compatible, but translate the UX into planning-led filter language:
  `Use case`, `Space type`, `Budget band`, `Material`, `Ergonomic features`, `Sustainability`, `Quick picks`.
- Add category-level planning entry blocks and quick presets.
- Improve empty states with recovery actions and guided next steps.

## Program G: Unified advanced configurator

### Reframe the experience
- Rename and position it as a workspace planning configurator.
- Replace dense single-page entry with guided stages:
  1. Project type
  2. Planning goal
  3. Room and capacity
  4. System options
  5. Recommendation
  6. Contact and submission

### Merge local strengths
- Keep the current planning engine as the computational base.
- Reuse the old configurator’s strongest interaction ideas:
  step navigation, preview framing, and summary patterns.
- Retire or quarantine duplicate configurator entry confusion after the unified flow lands.

### Persist planning outcomes
- Add a sticky summary rail on desktop and an accessible collapsible summary on mobile.
- Keep visible throughout:
  fit verdict, seat or unit count, footprint, room coverage, area efficiency, budget band, selected system, and recommendation state.

### Upgrade recommendation logic
- Tie recommendations to real catalog families and live route destinations.
- Show human-readable planning tradeoffs such as:
  `Best for dense operations floors`,
  `Better privacy, higher cost`,
  `Suitable for premium ergonomic deployment`,
  `Storage-heavy layout for admin teams`.

### Improve handoff and outputs
- Standardize the enquiry payload so sales receives:
  planning goal, fit verdict, room data, capacity, selected family, budget band, and option choices.
- Keep the summary useful to the customer before submission.
- Leave room for future dealer-grade outputs such as:
  downloadable summary, BOQ-lite, render export, or richer configurator asset exports.

### Expand entry and prefill behavior
- Support URL-based prefills:
  `type`, `series`, `layout`, `goal`, `roomWidth`, `roomLength`, `roomClearance`.
- PDPs and category pages should hand users into the configurator with context.

## Delivery Sequence
1. Normalize docs and repo state enough to keep execution clear.
2. Close remaining canonical data-model and audit gaps.
3. Finish shared copy and helper consolidation.
4. Polish shell and homepage residuals.
5. Upgrade product-page planning hierarchy.
6. Upgrade category pages and buyer-facing filters.
7. Build the unified advanced configurator and retire duplicate configurator confusion.
8. Re-run hardcoding verification, audit verification, and end-to-end validation.

## Validation

### Data and routing
- Supabase audits pass with no unresolved critical alias or orphan-reference issues.
- Nhost parity is documented and validated for the supported fallback path.
- Canonical and legacy slug resolution both work as intended.

### UX and planning journeys
- Category -> PDP -> configurator -> enquiry works.
- Category -> configurator direct entry works.
- Non-configurable category -> guided planning fallback works.
- Desktop and mobile both preserve summary clarity and CTA hierarchy.

### Checks
- `npm run lint`
- `npm test`
- `npm run build`
- Hardcoding scans for shared copy and visual formula regressions
- Route smoke tests for homepage, shell, category pages, PDPs, and configurator

## Final Acceptance Criteria
- The repo is clean and intentional.
- Canonical IDs and slugs are the active runtime model.
- Shared site and planner copy are centralized.
- Product pages and category filters feel planning-first rather than inventory-first.
- There is one clear advanced configurator experience.
- Customers receive useful planning outcomes before enquiry submission.
- Sales receives a cleaner and more actionable planning brief.
