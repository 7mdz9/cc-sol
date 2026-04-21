## Results — 2026-04-21

### Mobile (Chrome Lighthouse mobile emulation, Slow 4G-style throttling)
| Metric | Baseline | After | Delta |
| --- | --- | --- | --- |
| Lighthouse Perf | 74 | 88 | +14 |
| Accessibility | 81 | 80 | -1 |
| Best Practices | 100 | 96 | -4 |
| SEO | 91 | 91 | 0 |
| LCP | 4.51s | 3.15s | -1.36s |
| CLS | 0 | 0 | 0 |
| TBT | 0ms | 0ms | 0ms |
| TTI | 4.51s | 3.15s | -1.36s |
| Page weight | 0.34 MB | 0.20 MB | -0.13 MB |
| Requests | 45 | 46 | +1 |

### Desktop (no throttling)
| Metric | Baseline | After | Delta |
| --- | --- | --- | --- |
| Lighthouse Perf | 92 | 100 | +8 |
| Accessibility | 80 | 80 | 0 |
| Best Practices | 100 | 96 | -4 |
| SEO | 91 | 91 | 0 |
| LCP | 1.48s | 0.39s | -1.09s |
| CLS | 0 | 0.0005 | +0.0005 |
| TBT | 0ms | 0ms | 0ms |
| TTI | 1.21s | 0.39s | -0.82s |
| Page weight | 0.34 MB | 0.20 MB | -0.13 MB |
| Requests | 45 | 46 | +1 |

### What changed
- Replaced the shared 160 KB logo with a 14.6 KB WebP and a 25.0 KB optimized PNG fallback, then added explicit dimensions and `<picture>` markup for all four placements.
- Added logo preload and `fetchpriority="high"` so the critical logo asset is immediately discoverable.
- Added Google Fonts preconnects and reduced the requested families to the weights/styles actually used in the UI.
- Investigated the baseline `support.js` CPU spike and documented that it did not reproduce after the earlier fixes.
- Replaced the five broken menu image URLs, downloaded all 33 menu source JPEGs into the repo, and built a repeatable download script.
- Generated 198 optimized menu image variants (WebP + JPEG at 480/800/1200 widths) and rewired the preview panel to local responsive `<picture>` sources.
- Added `768px` and `480px` breakpoint rules so the mobile nav fits, hero CTAs stack, the menu preview is visible again below the category list, merch becomes one column on phones, and footer links stack cleanly.
- Added hero-canvas guards for `prefers-reduced-motion`, off-screen pause/resume, and a reduced particle count under `640px`.

### Validation
- Runtime image failures: 5 broken menu image URLs in baseline -> 0 broken image URLs after the replacement/download pass.
- External image domains: verified `0` `images.unsplash.com` requests after the responsive menu-image wiring; only Google Fonts remain external.
- Menu preview click-through: verified 33 local optimized image requests and 0 Unsplash requests during a full desktop-width click-through of all menu items.
- Canvas CPU: `hero-canvas.js` dropped from roughly 351ms total / 305ms scripting in the baseline mobile boot trace to 245ms total / 182ms scripting in the final mobile boot trace.

### Post-audit patch
- Disabled custom cursor initialization on touch and coarse-pointer devices in `scripts/cursor.js`, and restored the native cursor via a coarse-pointer / no-hover override in `styles/03-cursor.css`.
- Mobile Lighthouse Performance after the patch remained `88` (`88` before the patch), while mobile LCP improved slightly to `3.1s` (`3.15s` before the patch).
- The touch-device boot trace no longer shows meaningful custom-cursor work: `scripts/cursor.js` fell from about `341ms` total CPU in the prior final trace to well under `1ms` of traceable parse/compile work, with no runtime cursor initialization on the emulated mobile pass.

### What didn't hit target
- Mobile Lighthouse Performance finished at 88, short of the 90 target.
- Mobile LCP finished at 3.1s, above the 2.0s target.

### Top remaining issues
- The mobile LCP element is still the nav logo. The file is now tiny, so the remaining delay is render-time rather than transfer-time. Next step: remove or shorten initial hero/logo reveal delays on mobile so a larger hero element can paint earlier or the nav logo can paint sooner.
- `scripts/cursor.js` is now the largest mobile boot cost in the final trace at about 341ms total / 51ms scripting. Next step: disable the custom cursor entirely for coarse pointers and touch-sized viewports.
- Font loading still requires four Google-hosted font files because the UI uses italic Montserrat for small menu notes. Next step: either self-host a tighter subset or swap that note style to an already-loaded face to remove one request.
