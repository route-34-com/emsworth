# emsworth

Marketing website for **Emsworth Hospitality LLC FZ** — Dubai-based hospitality linen, towels, bathrobes and amenities, manufactured by Christy Textile Products, Tamil Nadu.

Built with [Astro](https://astro.build) as a static multi-page site.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview
```

Requires Node 18.20+ (Node 22 recommended).

## Pages

| Route | Content |
|---|---|
| `/` | Home: WebGL cloth hero, campaign, categories, designer teaser, tiers, mill numbers, export route map, enquiry |
| `/hospitality/` | Category overview |
| `/hospitality/[slug]/` | Bath linen, bed linen, robes & slippers, pool & beach, table & F&B, uniforms |
| `/collection/` | Designer Collection grid with pattern / colour filters |
| `/collection/[pattern]/` | Pattern page with colourway switcher (`?c=colour`) |
| `/tailor-made/` | Towel configurator and customisation options |
| `/about/` | Heritage, process, credentials |
| `/contact/` | Enquiry form (prefills from `?design=`, `?c=` and the configurator) |

## Structure

```
src/data/site.ts        all product, category and tier content
src/layouts/Base.astro  shared head, nav, footer, page transition
src/components/         page sections
src/pages/              routes
public/assets/          css, js (site.js, cloth.js), brand marks
public/images/          product photography as WebP (800 / 1600 / 2400 px)
```

## Content

Edit products, colourways and categories in `src/data/site.ts`. Image keys map to `public/images/<group>/<name>-<width>.webp`.

## Libraries (CDN)

GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js r128 (home only), Google Fonts (Mulish, Cormorant Garamond).
