# Webdevamin SEO Audit

Audit date: 2026-09-12  
Target: https://webdevamin.com  
Scope: live crawl plus repository verification  
Status: technical fixes applied locally; production deployment and live revalidation are pending

## Executive summary

SEOmator crawled 48 live URL variants and reported a score of 89/100 (grade B). Its compact report contained 381 failures, 2,298 warnings, 11,577 passes, and 1,680 checks that were not measured because the audit was run without local browser-based Core Web Vitals checks.

The most important confirmed problems were missing sitemap discovery, duplicated hreflang delivery through the next-intl HTTP `Link` header, missing security response headers, missing social images on the policy pages, unlabeled contact fields, one internal redirecting link, a broken structured-data image, and image loading/layout issues. These have been fixed in the repository where the cause was clear and local.

The DataForSEO OnPage task was accepted, but the connector stopped allowing status and result requests after task creation because the Codex usage limit was reached. Its result and cost were therefore not available to merge into this report. No workaround or duplicate paid request was made.

## Ahrefs-style overview

| Metric | Result | Source |
|---|---:|---|
| Live HTML URL variants crawled | 48 | SEOmator |
| Intended canonical URLs | 23 | Repository route and metadata inventory |
| SEO health score | 89/100, B | SEOmator baseline |
| Failures / errors | 381 | SEOmator |
| Warnings | 2,298 | SEOmator |
| Notices | Not provided by SEOmator | SEOmator uses pass, warning, failure |
| Passes | 11,577 | SEOmator |
| Not measured | 1,680 | SEOmator, browser-based checks skipped |
| DataForSEO task | `09120037-2403-0216-0000-2dd02002fdc2` | Task creation accepted; result retrieval blocked |
| DataForSEO cost | Not returned | Do not infer a cost from the task ID |

## Category scores

| Category | Score | Pass | Warning | Failure | Not measured |
|---|---:|---:|---:|---:|---:|
| Core SEO | 98 | 1,083 | 68 | 1 | 0 |
| Technical SEO | 97 | 701 | 67 | 48 | 0 |
| Performance | 84 | 614 | 244 | 6 | 384 |
| Links | 96 | 1,024 | 128 | 0 | 0 |
| Images | 85 | 479 | 193 | 0 | 0 |
| Security | 72 | 480 | 336 | 192 | 96 |
| Crawlability | 95 | 1,367 | 121 | 0 | 192 |
| Schema | 74 | 408 | 216 | 0 | 0 |
| Accessibility | 88 | 1,255 | 192 | 41 | 0 |
| Content | 81 | 607 | 230 | 75 | 0 |
| Social | 95 | 391 | 35 | 6 | 0 |
| E-E-A-T | 77 | 394 | 278 | 0 | 0 |
| URL structure | 99 | 665 | 7 | 0 | 0 |
| Mobile | 88 | 291 | 34 | 11 | 240 |
| Internationalization | 95 | 560 | 64 | 0 | 0 |
| Legal | 100 | 48 | 0 | 0 | 0 |
| JavaScript | 100 | 144 | 0 | 0 | 624 |
| Redirects | 100 | 384 | 0 | 0 | 144 |
| HTML validation | 100 | 523 | 5 | 0 | 0 |
| GEO readiness | 84 | 159 | 80 | 1 | 0 |

## Confirmed issues and fixes

### 1. Sitemap missing

- Severity: high
- Affected live crawl pages: all 48 pages inherited the same sitewide check
- Evidence: `/sitemap.xml` was 404 and `public/robots.txt` did not name a sitemap.
- Fix: added a Next.js metadata sitemap at `src/app/sitemap.js` containing the 23 canonical, indexable URLs and added `Sitemap: https://webdevamin.com/sitemap.xml` to `public/robots.txt`.
- Status: fixed and locally verified. The production build emits 23 unique `<loc>` entries.

### 2. Hreflang declared through two methods

- Severity: high
- Affected scope: 46 localized crawl pages according to SEOmator; the concrete broken alternate targets were the Dutch-only pages listed below.
- Evidence: page HTML contains the intended metadata alternates, while next-intl also emitted automatic HTTP `Link` alternates. Dutch-only pages therefore advertised nonexistent English equivalents.
- Affected URLs with invented English targets:
  - `https://webdevamin.com/nl/website-laten-maken-brugge`
  - `https://webdevamin.com/nl/industry/taxi-website-laten-maken`
  - `https://webdevamin.com/nl/industry/kapper-website-laten-maken`
  - `https://webdevamin.com/nl/industry/restaurant-website-laten-maken`
- Fix: set `alternateLinks: false` in `src/i18n/routing.js`, leaving the verified page-level alternates as the single source of truth.
- Status: fixed in source; requires deployment for live confirmation.

### 3. Missing security response headers

- Severity: critical in the crawler report
- Affected live crawl pages: all 48
- Evidence: missing HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`; `x-powered-by: Next.js` was also exposed.
- Fix: added safe global headers and `poweredByHeader: false` in `next.config.js`:
  - `Strict-Transport-Security: max-age=31536000`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Status: fixed in source; requires deployment for live confirmation. A CSP was not added because the site uses Google, PostHog, Cloudflare image URLs, inline consent code, and inline JSON-LD that require a separate compatibility pass.

### 4. Policy pages had no social preview image

- Severity: critical in the crawler report
- Affected URLs: `/policy`, `/nl/policy`, and the `/en/policy` redirect variant.
- Evidence: policy metadata did not define an image, so `og:image` and `twitter:image` were absent.
- Fix: `src/app/[locale]/policy/page.jsx` now uses the existing locale-specific fallback image.
- Status: fixed in source; requires deployment for live confirmation.

### 5. Contact form controls lacked accessible labels

- Severity: critical in the crawler report
- Affected source: `components/ContactForm.jsx`, rendered on the English and Dutch contact routes and their package query variants.
- Evidence: inputs had placeholders but no accessible label text. The compact SEOmator output listed `/contact`, `/en/contact`, `/nl/contact`, `/nl/contact?pakket=taxi`, and `/nl/contact?pakket=standaard`; it reported 19 affected variants in total.
- Fix: added screen-reader-only labels for name, email, and message, and an accessible name for the hidden honeypot field.
- Status: fixed in source and covered by the successful lint/build checks.

### 6. Empty headings

- Severity: critical in the crawler report
- Affected URLs: English home, Dutch home, and the Dutch industry pages.
- Evidence: the shared `Heading` component rendered an empty `<h3>` whenever a subtitle was empty.
- Fix: render the subtitle heading only when subtitle content exists in `components/Heading.jsx`.
- Status: fixed in source.

### 7. Trailing-slash duplicate URL variants

- Severity: warning in the crawler report
- Affected scope: page paths such as `/contact/`, `/nl/contact/`, and `/blogs/`.
- Evidence: the application disabled Next.js trailing-slash redirects globally for the PostHog proxy, leaving page paths accessible with and without a slash.
- Fix: `src/middleware.js` now redirects non-root page paths ending in `/` to the no-slash form while preserving query strings. The PostHog `/ingest` paths remain excluded by the matcher.
- Status: fixed in source; requires deployment for live confirmation.

### 8. Internal link redirected to English contact

- Severity: medium
- Source page: `https://webdevamin.com/`
- Bad target: `/en/contact` (one redirect to `/contact`)
- Fix: changed the raw link in `messages/en/pages/home.json` to `/contact`.
- Status: fixed in source.

### 9. Broken structured-data image

- Severity: medium
- Affected URL: `https://webdevamin.com/nl/website-laten-maken-brugge`
- Bad resource: `https://bucket.webdevamin.com/website-laten-maken-brugge_og.png` returned 404.
- Fix: changed the JSON-LD image in `messages/nl/pages/brugge.json` to the verified `.jpg` resource already used by the page metadata.
- Status: fixed in source.

### 10. Incorrect structured-data pricing

- Severity: medium
- Affected URLs: English and Dutch home pages.
- Evidence: the English Service schema said 74 while visible pricing said 79; the Dutch schema said 44 while visible pricing said 49.
- Fix: updated both `Offer.price` and `priceSpecification.price` in the two home JSON files to 79 and 49 respectively.
- Status: fixed in source.

### 11. Incorrect technology icon mapping

- Severity: low to medium
- Affected URLs: English and Dutch projects pages.
- Evidence: several Node.js technology entries used `javascript.svg`.
- Fix: corrected the Node.js entries in both project JSON files to `nodejs.svg`, preserving the JavaScript entries as `javascript.svg`.
- Status: fixed and validated against the technology names.

### 12. Blog image loading and layout stability

- Severity: medium
- Affected detail pages: all nine blog detail URLs.
- Evidence: detail pages hardcoded a 1152 by 400 image ratio even though blog data declares 1920 by 1109; two embedded images were raw, full-size bucket PNGs without intrinsic dimensions or lazy loading.
- Fixes:
  - Blog detail hero images now use each image's declared width and height.
  - `map.png` and `dashboard.png` are rewritten at render time to Cloudflare image-resizing URLs with intrinsic dimensions, lazy loading, and asynchronous decoding.
  - Project card images no longer all use `priority`.
  - Language flag images no longer use eager loading and priority in both desktop and mobile switchers.
- Status: fixed in source. The two source bucket images remain externally hosted; no R2 asset mutation was attempted.

### 13. External link safety

- Severity: warning
- Affected source: the Startup Fame link in `components/Layouts/Footer.jsx` and external buttons in shared hero/button components.
- Fix: added explicit `noopener noreferrer` where a new tab is opened.
- Status: fixed in source.

## Findings intentionally not changed

The following findings were reported but are outside safe technical changes or need a product/content decision:

- Long or short titles and descriptions, heading wording, reading level, link-anchor wording, E-E-A-T author/editorial signals, disclaimers, social share recommendations, and content depth. These would change marketing or legal copy.
- Near-duplicate `/en/*` and package-query pages. English-prefixed paths redirect to the canonical unprefixed routes, and package query strings are used to prefill the contact flow. They should be rechecked after deployment rather than removed speculatively.
- The unreachable LinkedIn URL reported by SEOmator. It may be a crawler-side block; the same profile is intentionally used in social and schema data and was not removed without confirmation.
- The external HTTP plus `www` redirect chain. This is controlled by Cloudflare and cannot be fixed in this repository.
- CSP enforcement. It requires testing the Google tag, PostHog proxy, Cloudflare images, fonts, inline consent code, and JSON-LD together.
- Lighthouse and field Core Web Vitals. The SEOmator run skipped browser checks, and no Google Search Console or CrUX connector was available.

## Canonical URL inventory

The repository defines 23 sitemap URLs:

- `https://webdevamin.com`
- `https://webdevamin.com/contact`
- `https://webdevamin.com/projects`
- `https://webdevamin.com/policy`
- `https://webdevamin.com/blogs`
- `https://webdevamin.com/nl`
- `https://webdevamin.com/nl/contact`
- `https://webdevamin.com/nl/projects`
- `https://webdevamin.com/nl/policy`
- `https://webdevamin.com/nl/blogs`
- `https://webdevamin.com/blogs/how-to-hire-webdesigner`
- `https://webdevamin.com/blogs/website-vs-webapplication`
- `https://webdevamin.com/blogs/vat-exemption-not-worth-it`
- `https://webdevamin.com/blogs/find-businesses-without-websites`
- `https://webdevamin.com/blogs/how-to-get-web-development-clients`
- `https://webdevamin.com/nl/blogs/hoe-webdesigner-inhuren`
- `https://webdevamin.com/nl/blogs/website-vs-webapplicatie`
- `https://webdevamin.com/nl/blogs/btw-vrijstelling-nadelig`
- `https://webdevamin.com/nl/blogs/vind-bedrijven-zonder-websites`
- `https://webdevamin.com/nl/website-laten-maken-brugge`
- `https://webdevamin.com/nl/industry/taxi-website-laten-maken`
- `https://webdevamin.com/nl/industry/kapper-website-laten-maken`
- `https://webdevamin.com/nl/industry/restaurant-website-laten-maken`

## Verification

- `npm run lint` passed with no warnings or errors.
- `npm run build` passed successfully.
- All 32 locale JSON files parse successfully.
- The generated sitemap contains 23 unique URLs.
- Technology icon mappings were checked for Node.js and JavaScript entries.
- No production deployment was performed.

## Revalidation required after deployment

Deploy the repository changes, then rerun DataForSEO or Ahrefs against the production domain. Confirm that the sitemap returns 200, automatic hreflang `Link` headers are absent, the five security headers are present, policy pages emit social images, slash variants redirect once, and the corrected image and structured-data resources return 200. The baseline score above must not be presented as a post-fix score until that live crawl is complete.
