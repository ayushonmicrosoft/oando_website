-- Slug alias plan (review before execution)
-- generated_at: 2026-03-07T14:56:11

insert into public.product_slug_aliases (alias_slug, canonical_slug, reason, is_active)
values ('fluid-x', 'oando-seating--fluid-x', 'auto-detected: duplicate name/subcategory with stronger canonical confidence', true)
on conflict (alias_slug) where is_active
do update set canonical_slug = excluded.canonical_slug, reason = excluded.reason, updated_at = now();
