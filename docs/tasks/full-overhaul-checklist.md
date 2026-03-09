# Full Overhaul Checklist

## Section 1: Repo normalization
- [x] Confirm `.DONOTDELETE` is excluded and absent from `git status`
- [x] Confirm local-only archive folders are excluded
- [ ] Stage docs move set
- [ ] Remove tracked `.github/workflows/supabase-backup.yml`
- [ ] Remove tracked `.vscode/*`
- [ ] Remove tracked root `cisco-sans/*`
- [ ] Remove tracked `oando_website/*`
- [ ] Repair broken script/doc references after path changes

## Section 2: Supabase audit
- [x] Add `scripts/audit_supabase_catalog.ts`
- [x] Add `scripts/audit_slug_id_integrity.ts`
- [x] Audit schema and migrations
- [x] Audit runtime queries
- [x] Audit row counts and null/blank slugs
- [x] Audit duplicate slugs and collisions
- [ ] Audit orphan references
- [x] Audit alias table health
- [x] Audit business stats integrity
- [x] Audit image/spec quality
- [x] Write tracked audit outputs to `docs/ops/audits/`

## Section 3: Canonical IDs and slug model
- [x] Freeze canonical category IDs
- [x] Freeze canonical subcategory IDs
- [x] Freeze canonical series ID strategy
- [ ] Add first-class subcategory fields if needed
- [x] Backfill canonical category IDs
- [x] Backfill canonical subcategory IDs
- [x] Generate canonical `category-subcategory-name` slugs
- [x] Populate alias rows for legacy slugs
- [ ] Add or verify uniqueness constraints and indexes
- [x] Audit post-migration integrity

## Section 4: Nhost mirror rebuild
- [x] Add `scripts/audit_nhost_backup.ts`
- [x] Rebuild sync to mirror canonical Supabase model
- [x] Mirror canonical tables
- [x] Mirror compatibility tables if runtime still needs them
- [x] Verify row counts
- [x] Verify alias parity
- [x] Verify stats parity
- [x] Verify GraphQL behavior
- [x] Verify SQL fallback behavior
- [x] Write tracked parity outputs to `docs/ops/audits/`

## Section 5: Core helper consolidation
- [x] Create one canonical slug/category/subcategory helper layer
- [x] Remove duplicate category-route maps
- [x] Canonicalize shared hook imports to `hooks/`
- [x] Add `data/site/*` scaffolding
- [x] Move fallback KPI defaults into config modules

## Section 6: Shell and design foundation
- [x] Define semantic foundation primitives in `app/globals.css`
- [x] Refactor header to foundation-driven style
- [x] Refactor footer to foundation-driven style
- [x] Refactor mobile nav to foundation-driven style
- [x] Refactor metadata and JSON-LD to use config modules
- [x] Refactor assistant surfaces to use shared config and helpers

## Section 7: Homepage overhaul
- [ ] Refactor active homepage sections to shared foundation classes
- [ ] Remove repeated local visual formulas
- [ ] Move repeated proof/contact/CTA copy into `data/site/*`
- [ ] Verify mobile hierarchy
- [ ] Verify desktop hierarchy
- [ ] Verify no floating-control collisions

## Section 8: Route rollout
- [x] About, trusted-by, projects, portfolio, gallery, and showrooms
- [x] Contact, solutions, configurator, planning, service, downloads, brochure, career, and sustainability
- [ ] Privacy, terms, imprint, and refund routes
- [ ] Products, category pages, and PDP routes for shared page-level copy only

## Section 9: Hardcoding verification
- [ ] Search for repeated region strings outside `data/site/*`
- [ ] Search for repeated CTA strings outside `data/site/*`
- [ ] Search for repeated trust/client strings outside `data/site/*`
- [x] Search for assistant prompt duplication
- [ ] Search for repeated arbitrary visual formulas in homepage and shell files

## Section 10: Final validation
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] Supabase audit passes
- [x] Nhost parity audit passes
- [x] Legacy slug aliases resolve
- [x] Canonical product URLs resolve
- [x] Desktop smoke checks pass
- [x] Mobile smoke checks pass
- [ ] Final repo state is clean and intentional
