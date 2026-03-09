# Oando Website Master Index

This folder is the single organized handoff pack for DB, assets, and rollout.

## 1) Execute in this order

1. Cloudflare R2/assets setup and upload:
   - `06_scripts/sync_public_images_to_r2.ps1`
2. Supabase migrations:
   - `01_sql/migrations/20260307150500_add_product_slug_aliases_and_name_key.sql`
   - `01_sql/migrations/20260307153500_rename_to_catalog_tables.sql`
3. Optional alias-plan SQL:
   - `01_sql/plans/slug-alias-plan-20260307-145611.sql`
4. Verify:
   - `02_reports/walkthroughs/database-walkthrough-with-filenames.md`
   - `02_reports/walkthroughs/cloudflare-r2-setup-status.md`

## 2) Folder map

- `01_sql` - migration and plan SQL
- `02_reports` - audits, plans, reconcile outputs, walkthroughs
- `03_charts` - PNG/SVG process charts
- `04_code` - code snapshots relevant to this rollout
- `05_config` - config snapshots
- `06_scripts` - operational scripts
- `99_bundles` - canonical bundle + archived older bundles

## 3) Canonical bundle

- `99_bundles/oando_website_bundle.zip`

## 4) Current state snapshot

- Cloudflare bucket: `oando-assets-prod` (created)
- Custom domain: `assets.oando.co.in` (connected)
- Supabase alias/name-key migration: prepared
- Supabase table-rename migration: prepared
