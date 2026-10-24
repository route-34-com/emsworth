import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://emsworth.example',
  // React only for the ReactBits galleries (accordion, orbit, carousel) on the collections page.
  integrations: [react()],
  // Heritage became About; Tailor-made folded into the Designer Collection (its towel studio sits at the end there).
  redirects: { '/heritage/': '/about/', '/tailor-made/': '/designer/',
    // The jacquard and plain towel designs moved from the Designer page into the Lookbook (bath & face towels).
    ...Object.fromEntries(['swirl', 'stripe', 'check', 'harlequin', 'animal', 'plain'].map((s) => [`/designer/${s}/`, `/lookbook/bath/${s}/`])) },
});
