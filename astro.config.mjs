import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.emsworthhospitality.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
