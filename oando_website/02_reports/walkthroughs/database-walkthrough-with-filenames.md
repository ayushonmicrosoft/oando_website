# Database Walkthrough (With File Names)

This is the exact runbook for upgrading the Supabase catalog database safely.

## 1) Take backup first

Use either:
- Supabase Dashboard backup/export
- Or local backup script: `scripts/backup_supabase.ts`

## 2) Migration order (apply in this sequence)

1. `supabase/migrations/20260307150500_add_product_slug_aliases_and_name_key.sql`
   - Adds slug alias table and policies
   - Adds `normalized_name_key` support
   - Adds duplicate-name collision view
   - Seeds `fluid-x -> oando-seating--fluid-x` alias

2. `supabase/migrations/20260307153500_rename_to_catalog_tables.sql`
   - Renames physical tables to `catalog_*`
   - Creates legacy compatibility views (`products`, `categories`, etc.)
   - Preserves app compatibility during cutover

3. Optional alias plan SQL:
   - `docs/ops/slug-alias-plan-20260307-145611.sql`
   - Applies auto-detected alias mappings

## 3) Core files in this upgrade

### SQL / migrations
- `supabase/migrations/20260307150500_add_product_slug_aliases_and_name_key.sql`
- `supabase/migrations/20260307153500_rename_to_catalog_tables.sql`
- `docs/ops/slug-alias-plan-20260307-145611.sql`
- `scripts/seed_data.sql` (baseline reference snapshot)

### Runtime code (slug + alias resolution)
- `lib/productSlugResolver.ts`
- `app/products/[category]/[product]/page.tsx`

### Planning / audit
- `scripts/plan_slug_aliases.py`
- `docs/ops/slug-alias-plan-20260307-145611.json`
- `docs/ops/slug-alias-plan-20260307-145611.md`
- `docs/ops/supabase-live-audit-20260307-144410.json`

## 4) Post-migration verification queries

Run in Supabase SQL Editor:

```sql
-- Physical renamed tables should exist
select to_regclass('public.catalog_products') as catalog_products;
select to_regclass('public.catalog_categories') as catalog_categories;
select to_regclass('public.catalog_product_specs') as catalog_product_specs;
select to_regclass('public.catalog_product_images') as catalog_product_images;
select to_regclass('public.catalog_product_slug_aliases') as catalog_product_slug_aliases;

-- Compatibility views should exist
select to_regclass('public.products') as products_view;
select to_regclass('public.categories') as categories_view;
select to_regclass('public.product_specs') as product_specs_view;
select to_regclass('public.product_images') as product_images_view;
select to_regclass('public.product_slug_aliases') as product_slug_aliases_view;

-- Alias row check
select alias_slug, canonical_slug, is_active
from public.catalog_product_slug_aliases
where alias_slug in ('fluid-x');

-- Duplicate name collision check
select * from public.product_name_collisions order by category_id, normalized_name_key;
```

## 5) App verification checklist

1. Open product via canonical URL:
   - `/products/seating/oando-seating--fluid-x`
2. Open product via alias URL:
   - `/products/seating/fluid-x`
3. Confirm alias URL redirects to canonical URL.
4. Confirm category pages load without missing data.
5. Run:
   - `npm run assets:audit:thirdparty`
   - `npx tsc --noEmit`

## 6) Rollback approach

If needed:
1. Restore DB backup snapshot.
2. Re-run previous stable migration state.
3. Keep runtime file `lib/productSlugResolver.ts` (it is backward compatible even if alias table is missing).

## 7) Notes

- This design minimizes downtime because legacy table names remain available as compatibility views.
- You can migrate app code to `catalog_*` table names later without urgency.
