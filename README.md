# emsworth

Marketing website for **Emsworth Hospitality LLC FZ** — Dubai-based hospitality linen, towels, bathrobes and amenities, manufactured by Christy Textile Products, Tamil Nadu.

Static single page: no build step.

## Run locally

```bash
python -m http.server 5173
```

Open http://127.0.0.1:5173

## Structure

```
index.html            page markup
assets/css/style.css  styles and theme tokens
assets/js/cloth.js    WebGL terry-cloth hero (Three.js shader)
assets/js/main.js     smooth scroll, scroll animations, towel configurator, route map, enquiry form
assets/img/           brand marks and product photography
```

## Libraries (CDN)

GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js r128, Google Fonts (Mulish, Cormorant Garamond).

## Notes

- Enquiry form opens the visitor's mail client addressed to `info@emsworthhospitality.com`.
- Swap photography by replacing files in `assets/img/` with the same names.
