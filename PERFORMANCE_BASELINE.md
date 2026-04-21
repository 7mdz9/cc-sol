## Baseline — 2026-04-21

### Mobile (Chrome Lighthouse mobile emulation, Slow 4G-style throttling)
- Lighthouse Performance: 74
- Lighthouse Accessibility: 81
- Lighthouse Best Practices: 100
- Lighthouse SEO: 91
- LCP: 4.51s (`<img src="public/assets/logo.png" alt="Soléa">`)
- CLS: 0
- TBT: 0ms
- TTI: 4.51s
- Page weight: 0.34 MB (349.8 KB)
- Request count: 45

### Desktop (no throttling)
- Lighthouse Performance: 92
- Lighthouse Accessibility: 80
- Lighthouse Best Practices: 100
- Lighthouse SEO: 91
- LCP: 1.48s (`<img src="public/assets/logo.png" alt="Soléa" class="hero-logo">`)
- CLS: 0
- TBT: 0ms
- TTI: 1.21s
- Page weight: 0.34 MB (349.8 KB)
- Request count: 45

### Image loading forensics
- Total images requested: 1 on initial load; 33 menu preview entries map to 31 unique Unsplash URLs
- Unsplash images: 31
  - https://images.unsplash.com/photo-1625444520903-d3a4d1e9a765?w=700&q=85
  - https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=85
  - https://images.unsplash.com/photo-1638176066960-c1b9cc9cb96f?w=700&q=85
  - https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=700&q=85
  - https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=700&q=85
  - https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&q=85
  - https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&q=85
  - https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=700&q=85
  - https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=85
  - https://images.unsplash.com/photo-1544145945-f90425340c7e?w=700&q=85
  - https://images.unsplash.com/photo-1497534446932-c925b458314e?w=700&q=85
  - https://images.unsplash.com/photo-1562119458-8f36e8d6d8d0?w=700&q=85
  - https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=700&q=85
  - https://images.unsplash.com/photo-1553530666-ba11a90a3dc4?w=700&q=85
  - https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=700&q=85
  - https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=85
  - https://images.unsplash.com/photo-1553530979-212cc573e2d1?w=700&q=85
  - https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=700&q=85
  - https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=700&q=85
  - https://images.unsplash.com/photo-1488900128323-21503983a07e?w=700&q=85
  - https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=85
  - https://images.unsplash.com/photo-1557142046-c704a3adf364?w=700&q=85
  - https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=700&q=85
  - https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=700&q=85
  - https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=700&q=85
  - https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=700&q=85
  - https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=700&q=85
  - https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=700&q=85
  - https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&q=85
  - https://images.unsplash.com/photo-1488477181946-6428a0291777?w=700&q=85
  - https://images.unsplash.com/photo-1563612116625-3012372fccce?w=700&q=85
- Images that failed, timed out, or took >3s: 5
  - https://images.unsplash.com/photo-1625444520903-d3a4d1e9a765?w=700&q=85 — status 404, 1.30s, items: Sparkling Fruit Drink
  - https://images.unsplash.com/photo-1638176066960-c1b9cc9cb96f?w=700&q=85 — status 404, 1.07s, items: Açaí Smoothie
  - https://images.unsplash.com/photo-1562119458-8f36e8d6d8d0?w=700&q=85 — status 404, 1.18s, items: Pineapple Coconut Drink
  - https://images.unsplash.com/photo-1553530666-ba11a90a3dc4?w=700&q=85 — status 404, 1.26s, items: Mango Peach Smoothie
  - https://images.unsplash.com/photo-1553530979-212cc573e2d1?w=700&q=85 — status 404, 1.03s, items: Strawberry Oat Smoothie
  - No successful image exceeded 3s in direct URL checks.
- Images without width/height: 5
- Images without `loading="lazy"`: 5
- Images without proper alt: 1

### Font forensics
- Font files requested: 3
- `https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2` — 34.7 KB transferred, 356ms
- `https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2` — 36.9 KB transferred, 356ms
- `https://fonts.gstatic.com/s/cormorantgaramond/v21/co3ZmX5slCNuHLi8bLeY9MK7whWMhyjYrEtImSqn7B6D.woff2` — 38.4 KB transferred, 350ms
- FOIT/FOUT behavior observed: `display=swap` is already present, so text falls back and swaps rather than staying invisible.

### Script execution
- `/scripts/support.js` — 623ms total CPU, 623ms scripting
- `/scripts/hero-canvas.js` — 351ms total CPU, 305ms scripting
- `/scripts/cursor.js` — 248ms total CPU, 37ms scripting
- `/` — 121ms total CPU, 1ms scripting
- `Unattributable` — 88ms total CPU, 5ms scripting
- Hero canvas FPS: 55.2 average `DrawFrame` FPS over the first 5s of a devtools-throttled mobile trace

### CWV notes
- Mobile LCP element: `<img src="public/assets/logo.png" alt="Soléa">`
- Mobile CLS contributors: `<li> (0.000033)`
- Desktop CLS contributors: `<ul class="nav-links"> (0.000023)`

### Network Waterfall
#### Mobile
```text
Type	Status	Transfer	Time	URL
Document	200	5.9 KB	1 ms	/
Stylesheet	200	1.4 KB	299 ms	https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;0,600;1,200;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap
Stylesheet	200	0.6 KB	3 ms	/styles/main.css
Image	200	160.1 KB	8 ms	/public/assets/logo.png
Script	200	0.8 KB	3 ms	/scripts/main.js
Stylesheet	200	0.4 KB	4 ms	/styles/01-tokens.css
Stylesheet	200	1.0 KB	4 ms	/styles/02-reset.css
Stylesheet	200	0.9 KB	7 ms	/styles/03-cursor.css
Stylesheet	200	2.1 KB	5 ms	/styles/04-nav.css
Stylesheet	200	3.6 KB	4 ms	/styles/05-hero.css
Stylesheet	200	1.0 KB	7 ms	/styles/06-marquee.css
Stylesheet	200	5.7 KB	8 ms	/styles/07-menu.css
Stylesheet	200	2.0 KB	9 ms	/styles/08-branches.css
Stylesheet	200	1.9 KB	7 ms	/styles/09-merch.css
Stylesheet	200	3.5 KB	9 ms	/styles/10-support.css
Stylesheet	200	0.9 KB	10 ms	/styles/11-footer.css
Stylesheet	200	0.9 KB	11 ms	/styles/12-utilities.css
Stylesheet	200	1.2 KB	12 ms	/styles/13-animations.css
Stylesheet	200	0.8 KB	11 ms	/styles/14-responsive.css
Script	200	0.8 KB	13 ms	/scripts/cursor.js
Script	200	0.3 KB	14 ms	/scripts/nav.js
Script	200	0.4 KB	14 ms	/scripts/reveal.js
Script	200	2.4 KB	14 ms	/scripts/menu.js
Script	200	1.2 KB	15 ms	/scripts/hero-canvas.js
Script	200	0.5 KB	17 ms	/scripts/marquee.js
Script	200	0.6 KB	17 ms	/scripts/branches.js
Script	200	0.7 KB	17 ms	/scripts/support.js
Script	200	0.7 KB	38 ms	/scripts/merch.js
Fetch	200	0.3 KB	1 ms	/data/marquee.json
Font	200	34.7 KB	356 ms	https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2
Font	200	36.9 KB	356 ms	https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2
Font	200	38.4 KB	350 ms	https://fonts.gstatic.com/s/cormorantgaramond/v21/co3ZmX5slCNuHLi8bLeY9MK7whWMhyjYrEtImSqn7B6D.woff2
Fetch	200	1.1 KB	1 ms	/data/branches.json
Fetch	200	9.7 KB	1 ms	/data/menu.json
Fetch	200	1.3 KB	1 ms	/data/merch.json
Fetch	200	1.6 KB	3 ms	/components/merch-svgs/signature-bottle.svg
Fetch	200	1.9 KB	4 ms	/components/merch-svgs/gold-tote-bag.svg
Fetch	200	1.8 KB	4 ms	/components/merch-svgs/solea-slides.svg
Fetch	200	1.9 KB	4 ms	/components/merch-svgs/sun-cap.svg
Fetch	200	2.2 KB	4 ms	/components/merch-svgs/solea-shades.svg
Fetch	200	4.7 KB	4 ms	/components/merch-svgs/beach-towel.svg
Fetch	200	3.7 KB	5 ms	/components/merch-svgs/candle-set.svg
Fetch	200	2.5 KB	5 ms	/components/merch-svgs/linen-tee.svg
Fetch	200	1.1 KB	1 ms	/data/contact.json
Other	200	3.8 KB	1 ms	/favicon.ico
```

#### Desktop
```text
Type	Status	Transfer	Time	URL
Document	200	5.9 KB	3 ms	/
Stylesheet	200	1.4 KB	303 ms	https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;0,600;1,200;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap
Stylesheet	200	0.6 KB	4 ms	/styles/main.css
Image	200	160.1 KB	6 ms	/public/assets/logo.png
Script	200	0.8 KB	4 ms	/scripts/main.js
Stylesheet	200	0.4 KB	5 ms	/styles/01-tokens.css
Stylesheet	200	1.0 KB	5 ms	/styles/02-reset.css
Stylesheet	200	0.9 KB	6 ms	/styles/03-cursor.css
Stylesheet	200	2.1 KB	8 ms	/styles/04-nav.css
Stylesheet	200	3.6 KB	9 ms	/styles/05-hero.css
Stylesheet	200	1.0 KB	9 ms	/styles/06-marquee.css
Stylesheet	200	5.7 KB	10 ms	/styles/07-menu.css
Stylesheet	200	2.0 KB	12 ms	/styles/08-branches.css
Stylesheet	200	1.9 KB	12 ms	/styles/09-merch.css
Stylesheet	200	3.5 KB	12 ms	/styles/10-support.css
Stylesheet	200	0.9 KB	13 ms	/styles/11-footer.css
Stylesheet	200	0.9 KB	15 ms	/styles/12-utilities.css
Stylesheet	200	1.2 KB	17 ms	/styles/13-animations.css
Stylesheet	200	0.8 KB	19 ms	/styles/14-responsive.css
Script	200	0.8 KB	19 ms	/scripts/cursor.js
Script	200	0.3 KB	21 ms	/scripts/nav.js
Script	200	0.4 KB	21 ms	/scripts/reveal.js
Script	200	2.4 KB	21 ms	/scripts/menu.js
Script	200	1.2 KB	21 ms	/scripts/hero-canvas.js
Script	200	0.5 KB	31 ms	/scripts/marquee.js
Script	200	0.6 KB	31 ms	/scripts/branches.js
Script	200	0.7 KB	41 ms	/scripts/support.js
Script	200	0.7 KB	43 ms	/scripts/merch.js
Fetch	200	0.3 KB	2 ms	/data/marquee.json
Font	200	34.7 KB	335 ms	https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2
Font	200	36.9 KB	335 ms	https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2
Font	200	38.4 KB	336 ms	https://fonts.gstatic.com/s/cormorantgaramond/v21/co3ZmX5slCNuHLi8bLeY9MK7whWMhyjYrEtImSqn7B6D.woff2
Fetch	200	1.1 KB	4 ms	/data/branches.json
Fetch	200	9.7 KB	1 ms	/data/menu.json
Fetch	200	1.3 KB	1 ms	/data/merch.json
Fetch	200	1.6 KB	3 ms	/components/merch-svgs/signature-bottle.svg
Fetch	200	1.9 KB	4 ms	/components/merch-svgs/gold-tote-bag.svg
Fetch	200	1.8 KB	3 ms	/components/merch-svgs/solea-slides.svg
Fetch	200	1.9 KB	3 ms	/components/merch-svgs/sun-cap.svg
Fetch	200	2.2 KB	4 ms	/components/merch-svgs/solea-shades.svg
Fetch	200	4.7 KB	4 ms	/components/merch-svgs/beach-towel.svg
Fetch	200	3.7 KB	4 ms	/components/merch-svgs/candle-set.svg
Fetch	200	2.5 KB	4 ms	/components/merch-svgs/linen-tee.svg
Fetch	200	1.1 KB	1 ms	/data/contact.json
Other	200	3.8 KB	1 ms	/favicon.ico
```
