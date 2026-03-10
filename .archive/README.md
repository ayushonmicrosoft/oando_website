# Archive Map

This folder holds non-runtime material that should stay out of the main app structure.

## Current Layout

- `root-legacy/`
  - older website assets, scripts, HTML, and migration leftovers kept for reference
- `tool-state/`
  - archived local tool/editor state moved out of the repo root
  - includes `.claude`, `.swc`, `.vscode`, and `.wrangler`
- `duplicate-assets/`
  - duplicate root assets that are not used by the live app
  - current example: duplicate `cisco-sans` font folder
- `test-artifacts/`
  - archived local test output such as `test-results`

## Notes

- This archive is not part of the live website runtime.
- `.DONOTDELETE/` is a separate protected archive area and is intentionally not managed from here.
