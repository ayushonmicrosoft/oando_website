# Advanced Configurator Overhaul Checklist

## Section 1: Benchmark and positioning
- [ ] Record benchmark findings from HON, Haworth, Knoll, and MillerKnoll sources
- [ ] Lock the advanced configurator principles in docs
- [ ] Define what the customer must get by stage 2 and stage 4
- [ ] Define which outputs are customer-facing vs sales-facing

## Section 2: Architecture unification
- [ ] Confirm the current primary configurator remains the base engine
- [ ] Extract the best stepper, preview, and summary patterns from the legacy configurator stack
- [ ] Decide which legacy configurator files become source material only
- [ ] Remove or quarantine duplicate configurator entry confusion after migration

## Section 3: Guided configurator flow
- [ ] Add guided stages:
  `Project type`, `Planning goal`, `Room and capacity`, `System options`, `Recommendation`, `Contact and submission`
- [ ] Add persistent summary rail on desktop
- [ ] Add mobile summary pattern that remains easy to access
- [ ] Surface fit verdict by the end of `Room and capacity`
- [ ] Surface recommendation state and budget band by the end of `System options`
- [ ] Add plain-language helper copy to each stage

## Section 4: Recommendation engine
- [ ] Tie recommendations to real catalog families and routes
- [ ] Add human-readable planning tradeoff labels
- [ ] Show alternatives such as dense, privacy-first, premium ergonomic, and storage-heavy paths
- [ ] Update recommendation output when core planning choices change
- [ ] Make the recommendation block feel decision-ready, not decorative

## Section 5: Advanced outputs and handoff
- [ ] Standardize the enquiry payload for planning submissions
- [ ] Include fit verdict, capacity, room data, budget band, and selected family in the payload
- [ ] Show a polished on-screen summary before submission
- [ ] Preserve shareable URL-based prefills
- [ ] Define future-ready placeholders for downloadable summary, BOQ-lite, or export support

## Section 6: PDP planning overhaul
- [ ] Redesign PDP hierarchy around planning questions
- [ ] Add `Plan this system` CTA for workstations and storages
- [ ] Add planning-oriented fallback CTA for non-configurable categories
- [ ] Add compact planning summary block above the fold
- [ ] Reduce action clutter and demote low-value actions
- [ ] Show related systems as planning alternatives, not generic cards

## Section 7: Category and filter overhaul
- [ ] Refactor filter UI into smaller buyer-facing units
- [ ] Replace raw facet framing with planning-led labels
- [ ] Add category-specific quick presets
- [ ] Improve empty states with recovery actions
- [ ] Add planning-entry module on category pages
- [ ] Preserve filter URL compatibility and shareable states

## Section 8: Content and route copy
- [ ] Add planner helper copy into `data/site/*`
- [ ] Add recommendation labels into shared route copy
- [ ] Add filter preset labels and empty-state guidance into shared copy
- [ ] Add planner CTA hierarchy for PDPs and category pages
- [ ] Remove duplicated inline planner copy where shared copy should own it

## Section 9: UX polish
- [ ] Ensure configurator looks premium on desktop
- [ ] Ensure configurator remains clear and usable on mobile
- [ ] Ensure summary and CTA hierarchy remain visible without overload
- [ ] Ensure diagrams, preview cards, and planning outcomes look intentional rather than debug-like

## Section 10: Validation
- [ ] Verify configurator step flow and summary accuracy
- [ ] Verify prefill behavior from PDP and category routes
- [ ] Verify recommendation changes follow user input correctly
- [ ] Verify enquiry submission still succeeds
- [ ] Verify PDP CTA hierarchy and planner handoff
- [ ] Verify filter presets, recovery states, and mobile behavior
- [ ] Run `npm run lint`
- [ ] Run `npm test`
- [ ] Run `npm run build`
