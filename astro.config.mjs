// @ts-check
import { defineConfig } from 'astro/config';

// Static output: the whole site builds to plain HTML/CSS in dist/.
// No server, no runtime, no per-request cost. Deploy it anywhere.
export default defineConfig({
  // GitHub Pages serves a project repo from a subpath, so `base` must match the
  // repo name or every stylesheet, font and link 404s. Astro rewrites its own
  // asset URLs from this; hand-written links need `import.meta.env.BASE_URL`.
  //
  // Moving to a custom domain later: set `site` to the domain, delete `base`,
  // and put a CNAME file in public/.
  site: 'https://JHanna-2020.github.io',
  base: '/coptic-logos-site/',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
});
