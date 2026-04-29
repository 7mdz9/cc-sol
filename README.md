# Solea

Solea — A sun-inspired cafe in Abu Dhabi. Pre-orders begin May 1, 2026.

This is a plain static site: HTML, CSS, and JavaScript with no build step.

## Tech Stack

- HTML5
- CSS3 with custom properties and split partials
- JavaScript ES modules
- Google Fonts: DM Serif Display and Inter
- No framework, bundler, or CMS

## Running Locally

Open `index.html` in a browser.

If your browser blocks ES modules from local files, serve the folder instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying

Deploy the repository to any static host. The site does not require server-side rendering or a build command.

Suitable hosts include Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static file server.

## Project Structure

- `index.html` — Solea homepage markup
- `styles/main.css` — CSS entry point and import order
- `styles/` — numbered CSS partials for tokens, layout, sections, animation, and responsive behavior
- `scripts/main.js` — JavaScript entry point
- `scripts/` — countdown, navigation, and reveal modules
- `_rebrand-source.html` — preserved source reference for the rebrand

## Current Sections

- Hero
- Brand
- Locations
- Goods
- Contact
- Footer
