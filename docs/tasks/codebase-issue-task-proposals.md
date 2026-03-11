# Codebase Issue Task Proposals + Design Options

This document lists four high-impact fixes and implementation design options for each.

## 1) Typo Fix Task
**Task:** Correct misspelled spec key value `Thouckness` to `Thickness` in the legacy product dataset.

- **Why it matters:** This typo is customer-visible in any UI rendering product specs and weakens content quality.
- **Evidence:** `lib/products.ts` contains `{ label: "Thouckness", value: "60mm" }`.
- **Suggested acceptance criteria:**
  - The label is corrected to `Thickness`.
  - Snapshot/UI checks for the affected product spec still pass.

### Design options
- **Option A (recommended): Direct string fix in source data**
  - Change only the typo in `lib/products.ts`.
  - **Pros:** Lowest risk, no runtime overhead.
  - **Cons:** Only fixes this known typo.
- **Option B: Runtime normalization map**
  - Add a label normalization layer (`Thouckness` -> `Thickness`) during render.
  - **Pros:** Can auto-heal future typos.
  - **Cons:** Adds complexity for a single typo.

## 2) Bug Fix Task
**Task:** Fix global canonical metadata behavior so non-home pages do not inherit `/` as canonical URL.

- **Why it matters:** Root layout currently sets `alternates: { canonical: "/" }`, which can cause duplicate canonical signals for deeper routes and hurt SEO indexing quality.
- **Evidence:** `app/layout.tsx` defines a root-level canonical of `/`.
- **Suggested acceptance criteria:**
  - Root layout keeps `metadataBase` only.
  - Each major route defines its own canonical path where needed.
  - Verify at least home + one category + one product route emit correct canonical links.

### Design options
- **Option A (recommended): Route-level canonical ownership**
  - Remove root `alternates.canonical`.
  - Set canonicals per page via route metadata.
  - **Pros:** Most correct for SEO and scale.
  - **Cons:** Requires touching key routes.
- **Option B: Dynamic canonical resolver utility**
  - Create helper deriving canonical from pathname centrally.
  - **Pros:** Single implementation point.
  - **Cons:** Higher implementation/testing complexity.

## 3) Comment/Documentation Discrepancy Task
**Task:** Align README deployment guidance with actual npm scripts (remove or replace `npm run seed` reference).

- **Why it matters:** README mentions `npm run seed` warnings, but no `seed` script exists in `package.json`, which is misleading for maintainers.
- **Evidence:** README references `npm run seed`, while `package.json` does not define a `seed` script.
- **Suggested acceptance criteria:**
  - README text references an existing workflow/script.
  - New developers can follow deployment instructions without hitting non-existent commands.

### Design options
- **Option A (recommended): Update README only**
  - Replace `npm run seed` mention with actual available workflows.
  - **Pros:** Minimal, immediate clarity.
  - **Cons:** Does not add a formal seeding command.
- **Option B: Add a real `seed` script to `package.json`**
  - Implement and document `npm run seed`.
  - **Pros:** Aligns with common expectations.
  - **Cons:** Requires script ownership + maintenance.

## 4) Test Improvement Task
**Task:** Make Supabase integration tests environment-aware so `npm test` does not fail when Supabase env vars are missing.

- **Why it matters:** Current integration suite fails in local/CI environments without live Supabase credentials, creating noisy failures unrelated to code regressions.
- **Evidence:** `tests/images.test.ts` runs real Supabase queries, and current test run fails with `Missing Supabase runtime env vars`.
- **Suggested acceptance criteria:**
  - Integration tests are skipped (or redirected to mocks) when required env vars are absent.
  - `npm test` passes in default local setup without Supabase secrets.
  - Integration path still runs when env vars are present.

### Design options
- **Option A (recommended): Conditional `describe` skip for integration block**
  - Gate with env presence check (`describe` vs `describe.skip`).
  - **Pros:** Simple, explicit, zero mock drift.
  - **Cons:** Reduced coverage without secrets.
- **Option B: Mock Supabase in unit-mode fallback**
  - Run deterministic mock assertions when env missing.
  - **Pros:** Preserves coverage in all environments.
  - **Cons:** More maintenance and fixture drift risk.
