import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://emsworth.route34solutions.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
