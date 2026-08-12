# Coptic Logos — landing page

Pre-launch landing page and beta signup for the Coptic Logos iPhone app.

**Live:** https://JHanna-2020.github.io/coptic-logos-site/

The iOS app lives in a separate private repository. This repo is public only
because GitHub Pages requires it; nothing here is app source.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321/coptic-logos-site/
npm run build    # static site in dist/
npm run preview  # serve the built site
npm run check    # typecheck
```

Note the dev URL includes the subpath — see the base path section below.

## The stack, and why

| Choice | Why |
|---|---|
| **Astro 7** | A landing page is content, not an application. Astro renders to plain HTML at build time and ships **zero JavaScript** unless asked. The one script here is ~1 KB of form handling. |
| **No React / Next.js** | Both would ship a JavaScript runtime to render text that never changes. |
| **Hand-written CSS, no Tailwind** | One page with a bespoke identity. Design tokens in `src/styles/global.css`; everything else scoped to its component by Astro. The CSS you read is the CSS that ships. |
| **Self-hosted fonts (Fontsource)** | An app whose pitch is "your data stays on your phone" should not hand every visitor to Google Fonts on page load. Only the Latin and Coptic subsets are imported. |
| **Static output** | No server, no runtime, no per-request cost, and nothing running that could be exploited. |

Current build: **55 KB of HTML** (8.8 KB gzipped) and five font files.

## Structure

```
src/
├── lib/coptic.ts            Coptic calendar maths — see note below
├── layouts/Base.astro       <head>, meta tags, skip link
├── styles/global.css        Design tokens, base type, shared controls
├── components/
│   ├── SiteHeader.astro
│   ├── Hero.astro           Today's date + headline + signup
│   ├── YearGrid.astro       The 365-dot Coptic year
│   ├── FirstVersion.astro   What ships in v1
│   ├── DailyClip.astro      The daily clip, and terms for contributors
│   ├── Refusals.astro       What the app will never do
│   ├── Trust.astro          Governance and privacy commitments
│   ├── SignupForm.astro     Used twice; falls back to mailto:
│   └── SiteFooter.astro
└── pages/index.astro
```

### `src/lib/coptic.ts`

The same logic that belongs in the Swift app, in a language you can iterate on
in a second rather than a build cycle. The Coptic year is twelve 30-day months
plus a short thirteenth month of 5 days (6 in a leap year, when
`year mod 4 == 3`). Conversion uses `Intl.DateTimeFormat` with the `coptic`
calendar rather than hand-rolled arithmetic — `Calendar(identifier: .coptic)`
is the Swift equivalent.

This covers the **civil** Coptic date only. Feasts, fasts, and anything derived
from Coptic Pascha are a separate problem and are not solved here.

Dates are computed in **UTC** at build time, so for a few hours each evening a
reader in North America will see tomorrow's date. Acceptable for a landing
page; not acceptable in the app, where it should follow the device's timezone.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages. The workflow also runs **daily at 04:15 UTC** — the
year grid is baked in at build time, so without a scheduled rebuild it would
sit on whatever day the site was last deployed.

You can trigger a deploy by hand from the repo's Actions tab
(*Deploy to GitHub Pages* → *Run workflow*).

### The base path

GitHub Pages serves a project repo from `/<repo-name>/`, so `astro.config.mjs`
sets `base: '/coptic-logos-site/'`. Astro rewrites its own asset URLs from
this, but **hand-written links must use `import.meta.env.BASE_URL`** rather
than a bare `/` — see `SiteHeader.astro`. A `/` link will 404 in production
while working perfectly in dev.

Moving to a custom domain later:

1. Set `site` to the domain and **delete the `base` line** in `astro.config.mjs`
2. Add `public/CNAME` containing just the domain
3. Point the DNS records at GitHub Pages and set the domain in repo Settings → Pages

## The signup form

There is no backend. Copy `.env.example` to `.env` and point
`PUBLIC_SIGNUP_ENDPOINT` at any service that accepts a plain form POST —
[Buttondown](https://buttondown.email) for a real mailing list,
[Formspree](https://formspree.io) if you just want the addresses.

Leave it unset and the form degrades to a `mailto:` link, which still works.

Because this is a static site, `PUBLIC_*` values are **baked into the HTML at
build time and are visible to anyone**. Only ever put public endpoints here —
never an API key.

## Before sharing the link widely

- [ ] Set `PUBLIC_CONTACT_EMAIL` to an address you actually read — the
      contributor button is a `mailto:` and currently points at a placeholder
- [ ] Wire up `PUBLIC_SIGNUP_ENDPOINT`
- [ ] Add an Open Graph image (`og:image` is declared but has no file yet).
      This is what previews when the link is pasted into WhatsApp or Messenger
- [ ] Publish a privacy policy and link it from the footer — required once you
      are collecting email addresses

## A standing rule for this page

Every claim here has to stay true. There are no testimonials, no App Store
badge, no screenshots of an app that does not exist yet, and no suggestion of
Church endorsement. The contributor terms in `DailyClip.astro` are promises to
real people. The disclaimer in the footer is not boilerplate — it is what keeps
this project honest, and it should survive every redesign.
