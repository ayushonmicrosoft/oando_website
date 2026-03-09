# Cloudflare Settings Audit (oando.co.in)

Date: 2026-03-07  
Audited by: CLI (`wrangler` + live endpoint checks)

## Remediation Run (2026-03-07, later session)
- Applied successfully:
  - R2 custom domain TLS minimum updated to `1.2` for `assets.oando.co.in`.
  - R2 CORS policy applied for:
    - `https://oando.co.in`
    - `https://www.oando.co.in`
    - methods: `GET`, `HEAD`
- Still blocked (permission scope issue):
  - Zone DNS changes (needed for DMARC and `www` record).
  - Zone setting changes (HTTPS/TLS/WAF toggles via API).
  - Provided short-lived API token validates, but returns zero accessible accounts/zones in API responses.

## DNS Reality Check
- `_dmarc.oando.co.in` already exists:
  - `v=DMARC1; p=none; rua=mailto:...@dmarc-reports.cloudflare.net`
- `www.oando.co.in` currently does not resolve.

## Scope
- Account/session authentication
- Zone/domain posture (as permitted by token scope)
- Cloudflare Pages projects/deploy posture
- R2 bucket + custom domain posture
- Live endpoint behavior and key headers

## Access Level Limitation
- Current OAuth session can read account and high-level zone metadata, but detailed Zone APIs return `403`.
- Blocked endpoints include:
  - `GET /zones/{zone_id}/dns_records`
  - `GET /zones/{zone_id}/settings/*`
- For full settings/DNS audit, token needs at least:
  - `Zone:Read`
  - `DNS:Read`
  - `Zone Settings:Read`

## Findings

### 1) Pages project has no Git provider link (High)
- `one-and-only-furniture` and `afc-oando` show `Git Provider: No`.
- Risk: deploy drift, manual deploy mistakes, no automatic preview/prod from GitHub.
- Recommendation:
  - Connect `one-and-only-furniture` to GitHub repo.
  - Enforce branch mapping (`main`/`production`) and PR preview deploys.

### 2) Production route coverage issue on live site (High)
- `https://oando.co.in/products/` returns `200`.
- `https://oando.co.in/products/seating` returns `404`.
- `https://oando.co.in/products/seating/?sub=Mesh%20chairs` returns `404`.
- Risk: category pages inaccessible from public domain.
- Recommendation:
  - Verify deployed build corresponds to current app routes.
  - Re-deploy latest branch after route checks.
  - Add uptime checks for key URLs (`/products/`, `/products/seating`, critical sub filters).

### 3) `www` host is missing DNS resolution (Medium)
- `www.oando.co.in` does not resolve.
- Recommendation:
  - Add `www` CNAME to apex (or redirect rule to apex).
  - Enable proxied record in Cloudflare and enforce canonical redirect.

### 4) R2 custom domain TLS floor is weak (High)
- Bucket: `oando-assets-prod`
- Custom domain: `assets.oando.co.in` is enabled.
- Reported `min_tls_version: 1.0`.
- Recommendation:
  - Raise to TLS `1.2` minimum (or `1.3` when client compatibility allows).

### 5) R2 bucket policy hardening gaps (Medium)
- `r2.dev` public URL is disabled (good).
- No CORS config present (`code: 10059` / none configured).
- No object lock rules.
- No event notification config.
- Recommendation:
  - Set explicit CORS allowlist for production origins.
  - Add lock rules for immutable release assets.
  - Add event notifications if you want pipeline-driven image validation/optimization.

### 6) Security headers partially present (Medium)
- Present: `x-content-type-options`, `referrer-policy`.
- Missing on sampled responses: explicit `strict-transport-security`, `content-security-policy`.
- Recommendation:
  - Add HSTS and CSP at app/edge layer.
  - Keep `http -> https` redirect (already active).

## Verified Current State
- Wrangler auth: logged in (`mayoite@gmail.com`), account `78e07661362639e5e9008dadd85a3f2d`.
- Zone: `oando.co.in` active on Cloudflare free plan.
- Nameservers: Cloudflare-assigned (`fattouche`, `lily`).
- Pages projects:
  - `one-and-only-furniture` (`oando.co.in`, `one-and-only-furniture.pages.dev`), last modified ~3 weeks ago.
  - `afc-oando` (`afc-oando.com`, `afc-oando.pages.dev`), last modified ~1 month ago.
- R2:
  - Bucket: `oando-assets-prod` (region `ENAM`)
  - Custom domain serves assets at `https://assets.oando.co.in/...` (`200 OK`)
  - `r2.dev` access disabled
  - Default multipart-abort lifecycle rule enabled

## Immediate Action Plan (Order)
1. Fix DNS for `www.oando.co.in` + canonical redirect.
2. Re-deploy `one-and-only-furniture` from latest Git commit and re-test category URLs.
3. Raise R2 custom domain minimum TLS to `1.2+`.
4. Add explicit R2 CORS policy for production origins.
5. Enable GitHub-connected deployment pipeline for Pages.
6. Apply HSTS + CSP headers and verify with curl checks.
