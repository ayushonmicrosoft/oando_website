# Advanced Configurator Overhaul Plan

## Title
Planning-first product, filter, and unified configurator overhaul with industry-grade guidance, visualization, and sales handoff.

## Summary
- Build one premium configurator that merges the live planning logic from the current `Simple2DConfigurator` with the staged guidance, preview, and summary patterns from the older configurator stack.
- Treat the configurator as a decision engine, not a cosmetic widget. It must help customers answer: `Will this fit?`, `How many seats or units will this support?`, `What budget band should I expect?`, and `Which system should I evaluate next?`
- Improve product pages and category filters so the configurator becomes part of one continuous journey from discovery to planning to qualified enquiry.
- Target a clearly more advanced experience than the current repo state: guided flow, better planning outcomes, deeper prefill behavior, stronger recommendations, clearer handoff to sales, and more trustworthy presentation.

## Current-State Findings

### Local product and configurator findings
- `components/configurator/Simple2DConfigurator.tsx` already has real customer value:
  room-fit checks, capacity calculations, budget ranges, planning coverage, and structured enquiry output.
- The older configurator stack under `components/configurator/` is stronger at staged decision-making:
  step navigation, preview framing, and summary presentation.
- The legacy `WINEA PRO` visual configurator is a useful visual reference, but it is generic and disconnected from the active catalog and current enquiry flow.
- The current product detail pages and category filters are functional, but they still behave more like catalog pages than planning surfaces.

### Industry benchmark findings
- HON official references show a modern configuration stack that supports product specification, quote request, detailed product-list output, rendering generation, and WebAR.
  Sources:
  - `https://www.hon.com/highlights/hon-unveils-integrated-3d-product-configuration-powered-3d-cloud`
  - `https://www.hon.com/configurator`
- Haworth product planning content emphasizes scalable workspace systems, modular elements, and reconfiguration over time rather than static one-off specification.
  Sources:
  - `https://www.haworth.com/na/en/products/compose-echo-workspaces.html`
  - `https://www.haworth.com/na/en/products/panel-based/compose-workspaces.html`
- Knoll frames workplace planning as a broader strategy problem:
  people, architecture, furniture, work modes, and future adaptability.
  Source:
  - `https://www.knoll.com/design-plan/planning-with-knoll`
- MillerKnoll's Geiger launch shows the value of immersive 3D clarity, online verification of product features and materials, and confidence in price/spec understanding.
  Source:
  - `https://news.millerknoll.com/2024-06-18-GEIGER-LAUNCHES-IMMERSIVE-3D-PRIVATE-OFFICE-CONFIGURATOR`

## What "Very Advanced" Means Here
- The configurator is not only prettier. It is materially more useful.
- Customers should get an early answer before submission, not only after filling the full form.
- The experience should support both planning logic and product optioning.
- The output should be credible enough for customers to share internally with procurement, facilities, or leadership.
- The handoff to sales should reduce clarification back-and-forth.

## Target Experience

### 1. One unified configurator
- Keep a single primary configurator experience.
- Merge the strongest parts of the two local patterns:
  - planning math, footprint logic, and budget estimation from the current planner
  - staged steps, preview framing, and summary design from the older configurator
- Retire or quarantine the legacy configurator entry points after their best ideas are absorbed.

### 2. Guided planning flow
- Replace the current dense single-page experience with a multi-stage flow:
  1. Project type
  2. Planning goal
  3. Room and capacity
  4. System options
  5. Recommendation
  6. Contact and submission
- Each stage must explain why the input matters.
- The first meaningful output must appear by the end of the `Room and capacity` stage.

### 3. Persistent planning rail
- Add a sticky summary rail on desktop and a pinned collapsible summary on mobile.
- Show live:
  - fit verdict
  - seat or unit count
  - footprint
  - room coverage
  - area efficiency
  - budget band
  - selected family or system
  - recommendation state
- Summary should feel boardroom-ready, not debug-like.

### 4. Stronger recommendation engine
- Turn the current suggestion logic into planning recommendations tied to real catalog families and real route destinations.
- Recommendation states should be human-readable, for example:
  - `Best for dense operations floors`
  - `Better privacy, higher cost`
  - `Suitable for premium ergonomic deployment`
  - `Storage-heavy layout for admin teams`
- Recommendations should update when layout, room size, or option choices change.
- The recommendation block should explain tradeoffs, not only list names.

### 5. Advanced entry and prefill behavior
- Add URL-based prefills for:
  - `type`
  - `series`
  - `layout`
  - `goal`
  - `roomWidth`
  - `roomLength`
  - `roomClearance`
- Product detail pages for workstations and storages should offer `Plan this system`.
- Non-configurable categories should offer `Get a planning recommendation`.
- Category pages should expose planner entry modules with relevant quick-start presets.

### 6. Advanced outputs and handoff
- Improve the customer-visible summary so it can be shared internally.
- Keep `/api/customer-queries` as the initial intake path, but standardize the message structure.
- Include in the enquiry payload:
  - planning goal
  - fit verdict
  - seat or unit count
  - recommended family
  - budget band
  - room data
  - key option choices
  - customer notes
- Add roadmap support for future dealer-grade outputs:
  - downloadable summary
  - shareable planning link
  - BOQ-lite or product list
  - render export
  - SIF-style asset export if later needed

## Product Page Overhaul

### 1. Planning-first PDP hierarchy
- Rework the product page so the top answers:
  what this system is, what planning role it plays, what use case it fits, and what the next action should be.
- Make the primary CTA either `Plan this system` or `Request quote`.
- Demote secondary actions like social sharing and lower-value action clutter.

### 2. Configurable vs non-configurable treatment
- Workstations and storages should expose:
  - planner-specific CTA
  - suggested layouts
  - option depth
  - prefills into the configurator
- Other categories should preserve a planning-first tone but route into guided planning rather than fake configurability.

### 3. Related-system intelligence
- Related systems should be framed as planning alternatives, not generic recommendations.
- Examples:
  - denser benching alternative
  - more private panel-based alternative
  - storage pairing recommendation
  - premium ergonomic upgrade path

## Filter and Category Page Overhaul

### 1. Buyer-facing filter language
- Keep the current API behavior, but improve the UI vocabulary.
- Replace raw facet framing with planning-led labels:
  - `Use case`
  - `Space type`
  - `Budget band`
  - `Material`
  - `Ergonomic features`
  - `Sustainability`
  - `Quick picks`

### 2. Presets and recovery
- Add one-tap presets such as:
  - `High density`
  - `Premium ergonomic`
  - `Executive`
  - `Training`
  - `Compact storage`
  - `Low-maintenance`
- Improve empty states with recovery actions:
  - clear one filter
  - broaden to similar systems
  - open planning configurator
  - compare top matches

### 3. Planning entry modules on category pages
- Add category-specific planning modules that explain what the configurator can do for the customer.
- Use category-aware quick starts to reduce blank-state friction.

## UX and Visual Standards
- Avoid a form-builder look.
- Use a premium visual hierarchy with strong typography, deliberate spacing, and outcome-led cards.
- Make planning results visually stronger than the inputs themselves.
- Show diagrams, layout cards, and recommendation modules as part of the journey, not as afterthoughts.
- Mobile and desktop both need explicit treatment. The summary, fit state, and CTA stack must stay clear on small screens.

## Public Interfaces and Content Changes
- Expand `data/site/*` and route copy for:
  - planning helper text
  - recommendation labels
  - configurator CTA hierarchy
  - filter preset labels
  - empty-state guidance
  - planner-entry copy on PDPs and category pages
- Preserve current filter URL compatibility unless a compatibility layer is intentionally added.
- Introduce stable configurator-prefill query params and document them in the codebase.

## Delivery Sequence
1. Document benchmark findings and lock advanced configurator principles.
2. Unify configurator architecture and retire duplicate entry confusion.
3. Refactor the configurator into guided stages with persistent summary.
4. Upgrade recommendation logic and enquiry payload structure.
5. Add PDP planner handoff and configurable/non-configurable differentiation.
6. Add category-page planning modules and buyer-facing filter presets.
7. Polish mobile and desktop presentation.
8. Validate with lint, tests, build, and journey-specific smoke checks.

## Test Plan
- Configurator:
  verify step progression, summary accuracy, fit logic, budget updates, recommendations, prefills, and enquiry submission.
- Product pages:
  verify CTA hierarchy, planner handoff, compare continuity, quote continuity, and canonical behavior.
- Filters:
  verify preset behavior, URL persistence, empty-state recovery, mobile usability, and active chip behavior.
- Cross-flow:
  verify category -> PDP -> configurator -> enquiry and category -> configurator direct flows.
- Validation:
  run `npm run lint`, `npm test`, and `npm run build`.

## Acceptance Criteria
- There is one clear primary configurator experience.
- Customers can get planning value before form completion.
- Product pages feel like planning surfaces, not only catalog pages.
- Category filters support buyer decisions, not only metadata narrowing.
- The enquiry payload is stronger and easier for sales to act on.
- The configurator benchmark gap versus leading office-furniture flows is visibly smaller in guidance, polish, and handoff depth.
