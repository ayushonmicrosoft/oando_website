# Master Overhaul Checklist

## Section 1: Repo normalization
- [ ] Formalize remaining docs move set
- [ ] Remove tracked legacy repo clutter and confirm intended tracked state
- [ ] Repair stale script and doc references after path cleanup
- [ ] Confirm final repo state is clean and intentional

## Section 2: Supabase and Nhost closure
- [ ] Audit orphan references
- [ ] Add or verify uniqueness constraints and indexes
- [ ] Close remaining alias coverage gaps
- [ ] Resolve canonical slug conflict cases
- [ ] Re-run Supabase audits
- [ ] Re-run Nhost parity audits
- [ ] Document GraphQL versus SQL fallback behavior intentionally

## Section 3: Canonical helper and copy consolidation
- [ ] Keep one canonical slug/category/subcategory helper layer
- [ ] Remove duplicate route maps and scattered legacy normalization
- [x] Move repeated site, trust, planner, CTA, and contact copy into `data/site/*`
- [ ] Remove assistant prompt duplication and route-copy drift

## Section 4: Shell and homepage finish
- [ ] Remove repeated local visual formulas in active shell and homepage components
- [ ] Align shell, homepage, and planner surfaces to one visual system
- [ ] Re-run hardcoding verification for active and retained legacy UI

## Section 5: Product page planning overhaul
- [x] Redesign PDP hierarchy around planning questions
- [x] Add `Plan this system` CTA for configurable families
- [x] Add planning-oriented fallback CTA for non-configurable categories
- [x] Add compact planning summary above the fold
- [x] Reduce low-value action clutter
- [x] Show related systems as planning alternatives

## Section 6: Filter and category-page overhaul
- [x] Refactor filter UI into smaller buyer-facing units
- [x] Replace raw facet framing with planning-led labels
- [x] Add category-specific quick presets
- [x] Improve empty states with recovery actions
- [x] Add planning-entry module on category pages
- [x] Preserve URL compatibility and shareable filter states

## Section 7: Unified advanced configurator
- [x] Confirm one primary configurator architecture
- [x] Merge planning engine strengths with legacy stepper and summary strengths
- [x] Add guided stages:
  `Project type`, `Planning goal`, `Room and capacity`, `System options`, `Recommendation`, `Contact and submission`
- [x] Add persistent summary rail on desktop
- [x] Add accessible mobile summary pattern
- [x] Surface fit verdict by stage 3
- [x] Surface recommendation state and budget band by stage 4
- [x] Tie recommendations to real catalog families and routes
- [x] Add human-readable planning tradeoff labels
- [x] Standardize enquiry payload for planning submissions
- [x] Support URL-based configurator prefills
- [x] Retire or quarantine duplicate configurator entry confusion

## Section 8: UX polish
- [ ] Ensure configurator looks premium on desktop
- [ ] Ensure configurator remains clear and usable on mobile
- [x] Ensure planning outcomes are more prominent than raw inputs
- [x] Ensure product pages, category pages, and configurator feel like one connected system

## Section 9: Validation
- [ ] Verify category -> PDP -> configurator -> enquiry flow
- [ ] Verify category -> configurator direct-entry flow
- [ ] Verify non-configurable categories route into guided planning correctly
- [ ] Verify canonical and legacy slug routing behavior
- [x] Run `npm run lint`
- [x] Run `npm test`
- [x] Run `npm run build`
