// Save helper for the hero editor (/hero-editor/): writes the placement into src/data/heroes.json and rebuilds the site,
// so the preview on :4350 shows it. Local only: run `npm run heroes` next to `npx astro preview --port 4350`.
import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const FILE = new URL('../src/data/heroes.json', import.meta.url);
const KEYS = ['home', 'collections', 'designer', 'stay'];
const NUM = ['z', 'px', 'py', 'tx', 'ty', 'tw', 'ts'];
let building = Promise.resolve();

const build = () => new Promise((done) => {
  const p = spawn('npx', ['astro', 'build'], { cwd: new URL('..', import.meta.url), stdio: 'ignore' });
  p.on('close', (code) => done(code === 0));
});

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.end();
  if (req.method !== 'POST' || !['/save', '/reset'].includes(req.url)) { res.statusCode = 404; return res.end(); }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', async () => {
    try {
      const { key, tune } = JSON.parse(body);
      if (!KEYS.includes(key)) throw new Error('unknown hero');
      const all = JSON.parse(fs.readFileSync(FILE, 'utf8'));
      if (req.url === '/reset') delete all[key];
      else {
        if (!NUM.every((k) => Number.isFinite(tune?.[k]))) throw new Error('bad values');
        all[key] = Object.fromEntries(NUM.map((k) => [k, Math.round(tune[k] * 1000) / 1000]));
      }
      fs.writeFileSync(FILE, JSON.stringify(all, null, 2) + '\n');
      building = building.then(build);
      const ok = await building;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ ok }));
    } catch (e) {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
    }
  });
}).listen(4361, () => console.log('Hero editor save helper on http://localhost:4361'));
