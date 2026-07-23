# Hanru Wehmeyer — Portfolio Site

Plain static HTML/CSS/JS, no build step, no framework. Ready to deploy as-is.

## Deploying to Vercel

1. Install the Vercel CLI: `npm install -g vercel` (or connect this folder as a GitHub repo and import it in the Vercel dashboard instead).
2. From this folder, run `vercel` and follow the prompts (first deploy creates the project; answer "no" to build step questions — this is a static site).
3. Run `vercel --prod` (or `vercel deploy --prod`) to publish to production.
4. Optional: attach a custom domain in the Vercel project's Domains settings.

No environment variables or build command are required — Vercel will serve `index.html`, `styles.css`, `script.js`, and `assets/` directly as static files.

## Still needs the client's input before launch

- **Contact form backend** — the form in `index.html`/`script.js` is front-end only (see the HTML comment above the `<form>`). Wire it to a service like Formspree, Basin, or Netlify Forms (set the form's `action` to the provider's endpoint and add `name` attributes as required by that provider).
- **Project screenshots** — five cards currently use CSS/SVG placeholder art (each marked with an HTML comment "replace with real project image"): Memor, Stori, Honours Dissertation, Admin Home Page, and Five Whys. Swap in real screenshots when available; the layout won't need restructuring.
- **Portfolio link / custom domain** — used as a placeholder in the CV header (`[PORTFOLIO LINK]`).
- **Email address** — placeholder `[EMAIL]` used in the Contact section and CV header.
- **LinkedIn URL** — placeholder `[LINKEDIN]` used in the Contact section and CV header.
- **Stori project dates** — the CV lists "2024" for the Stori/University of Dundee entry as a best-available placeholder; please confirm the exact date range.

## File structure

```
portfolio/
├── index.html              Main single-page site
├── styles.css               All styling
├── script.js                 Mobile nav toggle, front-end-only contact form, active-nav-link highlight
├── Hanru_Wehmeyer_CV.pdf     Downloadable CV (linked from the on-site CV section)
├── assets/
│   ├── hero-portrait.png
│   ├── about-portrait-1.png
│   └── about-portrait-2.png
└── README.md                 This file
```
