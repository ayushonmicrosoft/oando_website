# Slug Policy With Lane E Choices

## Goal
Eliminate name confusion by enforcing one canonical slug per product and managing legacy slugs as aliases.

## Canonical format
`{brand}-{category}-{model}`

Examples:
- `oando-seating-fluid-x`
- `oando-storages-prelam-storage`
- `oando-workstations-adaptable`

## Lane E (planning-only) choices
- `E1`: slug policy
  - `canonical-only`: reject non-canonical slugs.
  - `alias-redirect`: keep canonical slug, redirect legacy aliases.
  - `keep-legacy`: keep old slugs unchanged (not recommended).
- `E2`: spec strictness by category.
- `E3`: go/no-go preference at cutover.

## Live issues found (Supabase)
- Duplicate name in `seating`: `Fluid X`
  - `fluid-x` (legacy)
  - `oando-seating--fluid-x` (current pattern)
- Duplicate name in `storages`: `Prelam`
  - `oando-storage--prelam-storage`
  - `oando-storage--pedestal`

## Recommended decision
- Use `E1 = alias-redirect`.
- Keep one canonical slug per product.
- Store aliases in a mapping table and redirect old slugs at read layer.
