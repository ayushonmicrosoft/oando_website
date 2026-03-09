# Cloudflare R2 Setup Status (oando.co.in)

## Completed

- Account confirmed: `78e07661362639e5e9008dadd85a3f2d`
- Zone confirmed: `oando.co.in` (`a55de1facafcddb22a0707fe9b507264`)
- R2 bucket created: `oando-assets-prod`
- Custom domain connected: `assets.oando.co.in`
- Live URL check passed:
  - `https://assets.oando.co.in/images/hero/hero-1.webp` -> HTTP `200`
- Resumable bulk upload script added:
  - `06_scripts/sync_public_images_to_r2.ps1`

## Remaining

1. Upload full `public/images` dataset to R2.
2. Set runtime env:
   - `NEXT_PUBLIC_ASSET_HOSTNAME=assets.oando.co.in`
3. Run verification:
   - `npm run assets:audit:thirdparty`
   - product-page smoke checks

## Upload command

```powershell
powershell -ExecutionPolicy Bypass -File 06_scripts/sync_public_images_to_r2.ps1 -Bucket oando-assets-prod -SourceDir public/images -StartAt 0
```

## Notes

- `ownership_status` / `ssl_status` reported as pending/unknown briefly during propagation in CLI output; direct HTTPS fetch already succeeded.
- Keep the canonical bundle as source of truth:
  - `99_bundles/oando_website_bundle.zip`
