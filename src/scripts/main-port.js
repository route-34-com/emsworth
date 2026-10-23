// Behaviour ported from the main-branch site (public/assets/js/site.js there): word-by-word heading
// reveals, the home loader, number counters, the towel studio, the Gulf reach map and the designer-collection filters.
// Section code below is copied from that file; only the glue at the top and the studio's "send" are new.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { addToQuote, syncQuote } from './site';

(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);


  const reveal = (sel, trigger, vars = {}) => {
    if (!$(sel)) return;
    gsap.from(sel, Object.assign({ y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: trigger || sel, start: 'top 86%' } }, vars));
  };
  // Our hero line waits for this class, so it rises after the loader rather than behind it.
  const heroIn = () => document.documentElement.classList.add('is-ready');

  /* ---------- split text ---------- */
  function wrapWords(el) {
    const out = [];
    const walk = (node, emWrap) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { out.push(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const inner = document.createElement('span');
            if (emWrap) { const em = document.createElement('em'); em.textContent = part; inner.appendChild(em); }
            else inner.textContent = part;
            w.appendChild(inner);
            out.push(w);
          });
        } else if (n.nodeName === 'BR') out.push(document.createElement('br'));
        else if (n.nodeName === 'EM') walk(n, true);
        else out.push(n.cloneNode(true));
      });
    };
    walk(el, false);
    el.innerHTML = '';
    out.forEach((n) => el.appendChild(n));
    return $$('.w > span', el);
  }
  $$('.split').forEach((el) => {
    const words = wrapWords(el);
    gsap.set(words, { yPercent: 115, rotate: 4 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.05 }),
    });
  });

  $$('textPath').forEach((t) => { t.setAttribute('textLength', '486'); t.setAttribute('lengthAdjust', 'spacing'); });
  // Every section heading on the site rises word by word, as on the main site.
  $$('main h2:not(.split)').forEach((el) => {
    if (el.closest('.hero, .panel, [data-no-split]')) return;
    el.classList.add('split');
    const words = wrapWords(el);
    gsap.set(words, { yPercent: 115, rotate: 4 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.05 }) });
  });

  /* ---------- home loader ---------- */
  const loaderEl = $('#loader');
  let seen = false;
  try { seen = sessionStorage.getItem('emsLoaderSeen') === '1'; sessionStorage.setItem('emsLoaderSeen', '1'); } catch (e) {}
  if (loaderEl && !seen && !reduce) {
    body.classList.add('is-loading');
    gsap.set('.hdr', { yPercent: -120 });
    const lp = $('#loaderPath');
    const len = lp.getTotalLength();
    gsap.set(lp, { strokeDasharray: len, strokeDashoffset: len });
    const counter = { v: 0 };
    let loaded = document.readyState === 'complete';
    window.addEventListener('load', () => (loaded = true));
    const tl = gsap.timeline({ paused: true });
    tl.to(lp, { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut' }, 0)
      .to(counter, { v: 100, duration: 2.2, ease: 'power3.inOut', onUpdate: () => ($('#loaderCount').textContent = String(Math.round(counter.v)).padStart(3, '0')) }, 0)
      .to('.loader__logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut' }, 1.1)
      .addPause('+=0.05', () => {
        const go = () => tl.play();
        if (loaded) go(); else { window.addEventListener('load', go, { once: true }); setTimeout(go, 3500); }
      })
      .to('.loader__inner', { autoAlpha: 0, y: -30, duration: 0.6, ease: 'power2.in' })
      .to('.loader__panel--top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.15')
      .to('.loader__panel--bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
      .to('.hdr', { yPercent: 0, duration: 1, ease: 'expo.out' }, '<0.3')
      .add(() => { body.classList.remove('is-loading'); heroIn(); }, '<0.2')
      .add(() => loaderEl.remove());
    tl.play();
  } else {
    if (loaderEl) loaderEl.remove();
    heroIn();
  }

  /* ---------- numbers ---------- */
  if ($('.numbers')) {
    gsap.fromTo('.numbers__bg', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.numbers', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    $$('.count').forEach((el) => {
      const to = +el.dataset.to;
      const from = el.hasAttribute('data-plain') ? 1960 : 0;
      const o = { v: from };
      el.textContent = from;
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 2.4, ease: 'expo.out', onUpdate: () => (el.textContent = Math.round(o.v)) }),
      });
    });
    reveal('.stat', '.numbers__grid');
  }


  /* ---------- studio ---------- */
  if ($('#towel')) {
    const state = { size: 'BT', w: 70, h: 140, colour: '#F8F5EF', colourName: 'Optical White', border: 'dobby', gsm: 650, text: 'Aurum', thread: '#B8955E' };
    const ns = 'http://www.w3.org/2000/svg';
    const shade = (hex, amt) => {
      const n = parseInt(hex.slice(1), 16);
      const f = (c) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
      return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join('');
    };
    const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
    const rect = (x, y, w, h, fill) => { const r = document.createElementNS(ns, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('fill', fill); return r; };
    const tier = (g) => (g < 500 ? ['ES', 'Essential'] : g < 600 ? ['CL', 'Classic'] : ['SG', 'Signature']);
    const advice = {
      ES: 'Staff accommodation, back of house and pool decks — honest construction at an honest weight.',
      CL: 'High-turnover guest rooms — still looks like itself two hundred cycles later.',
      SG: 'Suites, presidential floors and spa — where the towel argues for the room rate.',
    };

    const render = (animate) => {
      const sc = Math.min(320 / state.w, 540 / state.h);
      const tw = state.w * sc, th = state.h * sc, tx = 200 - tw / 2, ty = 40;
      const band = lum(state.colour) > 0.7 ? shade(state.colour, -0.05) : shade(state.colour, 0.08);
      const dark = shade(state.colour, lum(state.colour) > 0.5 ? -0.12 : -0.06);
      $('#towelBase').setAttribute('fill', state.colour);
      ['x', 'y', 'width', 'height'].forEach((k, i) => {
        const v = [tx, ty, tw, th][i];
        $('#towelBase').setAttribute(k, v);
        $('#towelClipRect').setAttribute(k, v);
      });
      $$('#patDobby rect')[0].setAttribute('fill', band);
      $$('#patDobby rect').slice(1).forEach((r) => r.setAttribute('fill', dark));
      $('#patJacq rect').setAttribute('fill', dark);
      $('#patJacq g').style.color = band;
      $$('#gSatin stop').forEach((s, i) => i !== 1 && s.setAttribute('stop-color', band));

      const bh = Math.max(14, th * 0.07);
      [['#bandTop', ty + th * 0.07], ['#bandBot', ty + th * 0.86 - bh]].forEach(([sel, y]) => {
        const g = $(sel);
        g.innerHTML = '';
        if (state.border === 'dobby') g.appendChild(rect(tx, y, tw, bh, 'url(#patDobby)'));
        if (state.border === 'jacquard') g.appendChild(rect(tx, y - bh * 0.4, tw, bh * 1.8, 'url(#patJacq)'));
        if (state.border === 'satin') {
          g.appendChild(rect(tx, y, tw, bh, 'url(#gSatin)'));
          g.appendChild(rect(tx, y + 2, tw, 1, dark));
          g.appendChild(rect(tx, y + bh - 3, tw, 1, dark));
        }
        if (state.border === 'cam') { g.appendChild(rect(tx, y + bh * 0.2, tw, 3, dark)); g.appendChild(rect(tx, y + bh * 0.7, tw, 3, dark)); }
      });

      const t = $('#towelText');
      t.textContent = state.text || '';
      t.setAttribute('y', ty + th * 0.72);
      t.style.fontSize = Math.min(46, tw / 6.2) + 'px';
      t.style.fill = state.thread;
      t.style.stroke = lum(state.thread) > 0.6 ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.22)';

      const k = (state.gsm - 400) / 350;
      $('#pileTurb').setAttribute('baseFrequency', (1.1 - k * 0.35).toFixed(2));
      $('#pileDisp').setAttribute('scale', (1.5 + k * 4.5).toFixed(1));
      $('#pile feColorMatrix').setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${(-0.45 - k * 0.55).toFixed(2)} ${(0.3 + k * 0.3).toFixed(2)}`);

      const [code, name] = tier(state.gsm);
      $('#specCode').textContent = `EM-${state.size}-${code}-${state.w}${String(state.h).padStart(3, '0')}`;
      $('#gsmVal').textContent = state.gsm;
      $('#gsmTier').textContent = name;
      $('#colourName').textContent = state.colourName;
      $('#gsm').style.setProperty('--p', k * 100 + '%');
      const adv = $('#advice');
      if (adv.dataset.code !== code) {
        adv.dataset.code = code;
        gsap.fromTo(adv, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6 });
        adv.textContent = advice[code];
      }
      if (animate) gsap.fromTo('#towelBody', { scaleY: 0.96, scaleX: 1.03, transformOrigin: '50% 0%' }, { scaleY: 1, scaleX: 1, duration: 1.2, ease: 'elastic.out(1,0.35)' });
    };

    $$('.studio__panel [data-key]').forEach((grp) => {
      grp.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        $$('button', grp).forEach((x) => x.classList.toggle('on', x === b));
        const key = grp.dataset.key;
        if (key === 'size') Object.assign(state, { size: b.dataset.v, w: +b.dataset.w, h: +b.dataset.h });
        if (key === 'colour') Object.assign(state, { colour: b.dataset.v, colourName: b.dataset.name });
        if (key === 'border') state.border = b.dataset.v;
        if (key === 'thread') state.thread = b.dataset.v;
        render(true);
      });
    });
    $('#gsm').addEventListener('input', (e) => { state.gsm = +e.target.value; render(false); });
    $('#gsm').addEventListener('change', () => render(true));
    $('#embText').addEventListener('input', (e) => { state.text = e.target.value; render(false); });
    render(false);

    gsap.from('.towel', { y: -120, rotate: -6, autoAlpha: 0, duration: 1.8, ease: 'elastic.out(1,0.5)', scrollTrigger: { trigger: '.studio__stage', start: 'top 75%' } });
    gsap.from('.studio__panel fieldset, #sendSpec', { x: 40, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.studio__panel', start: 'top 80%' } });

    $('#sendSpec').addEventListener('click', () => {
      const sizeName = $('.seg[data-key="size"] .on').textContent;
      const borderName = $('.seg[data-key="border"] .on').textContent;
      const msg = `Sample request — ${$('#specCode').textContent}\n${sizeName} · ${state.colourName} · ${state.gsm} GSM (${tier(state.gsm)[1]}) · ${borderName} border${state.text ? ` · Embroidered "${state.text}"` : ''}\n\nRooms / quantity: `;
      try { sessionStorage.setItem('emsSpec', msg); } catch (e) {}
      addToQuote({ id: 'spec-' + $('#specCode').textContent.trim(), name: `Towel spec ${$('#specCode').textContent.trim()} · ${sizeName} · ${state.colourName} · ${state.gsm} GSM · ${borderName}${state.text ? ` · "${state.text}"` : ''}`, group: 'Tailor-made' });
    });
  }


  /* ---------- map ---------- */
  if ($('#mapCanvas')) {
    const cv = $('#mapCanvas');
    // Map colours come from the active palette (main hard-coded teal, sand, peach and brass): resolved to RGB once,
    // and again when the palette is switched, because a canvas cannot read CSS variables.
    const probe = document.createElement('i'); probe.style.display = 'none'; cv.parentNode.appendChild(probe);
    const rgbOf = (k) => {
      probe.style.color = `var(${k})`;
      const n = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
      return getComputedStyle(probe).color.startsWith('color(') ? n.slice(0, 3).map((v) => Math.round(v * 255)) : n.slice(0, 3);
    };
    let RGB = {};
    const readPalette = () => { RGB = Object.fromEntries(['--sand', '--peach', '--brass'].map((k) => [k, rgbOf(k)])); };
    readPalette();
    new MutationObserver(readPalette).observe(document.documentElement, { attributes: true, attributeFilter: ['data-palette'] });
    const tint = (k, a) => `rgba(${RGB[k].join(',')},${a})`;
    const pal = (k) => tint(k, 1);
    const ctx = cv.getContext('2d');
    const labels = $('#mapLabels');
    const LAND = [
      [[35, 28], [39, 22], [43, 13], [45, 12.8], [52, 16], [57, 19], [59.8, 22.5], [56.5, 26.5], [52, 24], [50.5, 26], [48, 29.5], [47, 30], [39, 32], [35, 32]],
      [[-17, 21], [-10, 30], [-5, 35.8], [10, 37], [11, 33], [20, 31], [32, 31.5], [35, 28], [43, 12], [51, 11.8], [41, -2], [40, -11], [35, -24], [26, -34], [18, -34], [12, -17], [9, -1], [9, 4], [-8, 4.5], [-17, 14]],
      [[68, 23.5], [72, 21], [73, 16], [76.5, 8.2], [80, 10], [80.3, 15.5], [87, 21.5], [89, 22], [92, 22.5], [92, 26], [88, 27], [81, 30], [78, 35], [74, 34.5], [70, 28], [68.5, 25]],
      [[44, 37], [48, 30], [50.5, 29.5], [56.5, 27], [61.5, 25.2], [66.5, 25.4], [68, 23.5], [70, 28], [74, 34.5], [71, 36.7], [60, 37.5], [54, 37.3], [48, 38.5], [44, 39.5]],
      [[35, 32], [36, 36], [28, 36.5], [26, 40], [44, 39.5], [44, 37], [39, 32]],
      [[79.7, 9.8], [81.9, 7.5], [81.2, 6.1], [80, 6], [79.8, 8]],
    ];
    const HUB = { n: 'Jebel Ali · Dubai', s: 'Emsworth hub', lon: 55.0, lat: 25.0, big: true, a: 't' };
    const MILL = { n: 'Tiruchengode', s: 'Christy mill', lon: 77.9, lat: 11.4, big: true };
    const DEST = [
      { n: 'Riyadh', lon: 46.7, lat: 24.7, a: 'l' }, { n: 'Doha', lon: 51.5, lat: 25.3, hide: true }, { n: 'Muscat', lon: 58.4, lat: 23.6, a: 'b' },
      { n: 'Kuwait', lon: 47.9, lat: 29.4 }, { n: 'Manama', lon: 50.6, lat: 26.2, hide: true }, { n: 'Jeddah', lon: 39.2, lat: 21.5, a: 'l' },
      { n: 'Cairo', lon: 31.2, lat: 30.0, a: 'l' }, { n: 'Nairobi', lon: 36.8, lat: -1.3 }, { n: 'Addis Ababa', lon: 38.7, lat: 9.0 }, { n: 'Mombasa', lon: 39.7, lat: -4.0, hide: true },
    ];
    const inPoly = (pt, poly) => {
      let c = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    let W, H, dpr, proj, dots = [];
    const state = { p: 0 };
    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      const lon0 = 25, lon1 = 83, lat0 = -6, lat1 = 37;
      const sc = Math.min(W / (lon1 - lon0), H / (lat1 - lat0)) * 1.04;
      const ox = (W - (lon1 - lon0) * sc) / 2, oy = (H - (lat1 - lat0) * sc) / 2;
      proj = (lon, lat) => [ox + (lon - lon0) * sc, oy + (lat1 - lat) * sc];
      dots = [];
      const step = Math.max(7, W / 70);
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
        const lon = (x - ox) / sc + lon0, lat = lat1 - (y - oy) / sc;
        dots.push([x, y, LAND.some((p) => inPoly([lon, lat], p))]);
      }
      labels.innerHTML = '';
      [HUB, MILL, ...DEST].forEach((d) => {
        if (d.hide) return;
        const [x, y] = proj(d.lon, d.lat);
        const el = document.createElement('div');
        el.className = 'mlabel' + (d.big ? ' big' : '');
        el.innerHTML = d.n + (d.s ? `<small>${d.s}</small>` : '');
        el.style.left = x + 'px'; el.style.top = y + 'px';
        if (d === MILL) { el.style.transform = 'translate(calc(-100% + 10px), 16px)'; el.style.textAlign = 'right'; }
        if (d.a === 'l') el.style.transform = 'translate(calc(-100% - 10px), -50%)';
        if (d.a === 'b') el.style.transform = 'translate(-30%, 10px)';
        if (d.a === 't') el.style.transform = 'translate(-20%, calc(-100% - 14px))';
        labels.appendChild(el);
        d.el = el;
      });
    };
    const bez = (a, b, u, lift) => {
      const [x1, y1] = proj(a.lon, a.lat), [x2, y2] = proj(b.lon, b.lat);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * lift;
      return [(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2];
    };
    const arc = (a, b, t, lift) => { const pts = []; for (let i = 0; i <= 40 * t; i++) pts.push(bez(a, b, i / 40, lift)); return pts; };
    let visible = false, time = 0;
    const draw = () => {
      if (!visible) return;
      time += 0.016;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      dots.forEach(([x, y, land]) => {
        ctx.fillStyle = land ? tint('--sand', .42) : tint('--sand', .07);
        ctx.beginPath(); ctx.arc(x, y, land ? 1.6 : 1, 0, Math.PI * 2); ctx.fill();
      });
      const p1 = gsap.utils.clamp(0, 1, state.p * 2.2);
      const line = (pts, color, w) => { if (pts.length < 2) return; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
      line(arc(MILL, HUB, p1, 0.35), pal('--brass'), 2.4);
      DEST.forEach((d, i) => {
        const t = gsap.utils.clamp(0, 1, (state.p - 0.4 - i * 0.03) * 4);
        line(arc(HUB, d, t, 0.25), tint('--peach', .75), 1.2);
        if (d.el) d.el.style.opacity = t > 0.95 ? 1 : 0;
        if (t >= 1) {
          const [x, y] = bez(HUB, d, (time * 0.35 + i * 0.13) % 1, 0.25);
          ctx.fillStyle = pal('--sand'); ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
          const [ex, ey] = proj(d.lon, d.lat);
          ctx.fillStyle = pal('--peach'); ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
        }
      });
      if (p1 >= 1) {
        const [x, y] = bez(MILL, HUB, (time * 0.25) % 1, 0.35);
        ctx.fillStyle = pal('--sand'); ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      }
      [MILL, HUB].forEach((d) => {
        const [x, y] = proj(d.lon, d.lat);
        const pulse = (time * 0.8) % 1;
        ctx.strokeStyle = tint('--brass', 1 - pulse); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 5 + pulse * 22, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = pal('--brass'); ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        if (d.el) d.el.style.opacity = state.p > 0.05 ? 1 : 0;
      });
      requestAnimationFrame(draw);
    };
    layout();
    new IntersectionObserver((en) => { const was = visible; visible = en[0].isIntersecting; if (visible && !was) draw(); }).observe(cv);
    window.addEventListener('resize', layout);
    ScrollTrigger.create({ trigger: '.reach__map', start: 'top 80%', once: true, onEnter: () => gsap.to(state, { p: 1, duration: 4.5, ease: 'power2.inOut' }) });
    reveal('.reach__list li', '.reach__list', { x: -30, y: 0, stagger: 0.07 });
  }


  /* ---------- collection filters ---------- */
  if ($('#pgrid')) {
    const cards = $$('.pcard');
    const f = { pattern: 'all', colour: 'all' };
    const apply = () => {
      const shown = [], hidden = [];
      cards.forEach((c) => {
        const ok = (f.pattern === 'all' || c.dataset.pattern === f.pattern) && (f.colour === 'all' || c.dataset.colour === f.colour);
        (ok ? shown : hidden).push(c);
      });
      gsap.to(hidden, { autoAlpha: 0, scale: 0.92, duration: 0.3, onComplete: () => hidden.forEach((c) => (c.style.display = 'none')) });
      shown.forEach((c) => (c.style.display = ''));
      gsap.fromTo(shown, { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.025, delay: 0.3, onComplete: () => ScrollTrigger.refresh() });
      $('#shopCount').textContent = shown.length;
    };
    $$('[data-filter]').forEach((g) => {
      g.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        $$('button', g).forEach((x) => x.classList.toggle('on', x === b));
        f[g.dataset.filter] = b.dataset.v;
        apply();
      });
    });
    gsap.from(cards.slice(0, 12), { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '#pgrid', start: 'top 90%' } });
    reveal('.filters', '.filters', { y: 30 });
  }

  /* ---------- product page colourways ---------- */
  if ($('#pdpData')) {
    const data = JSON.parse($('#pdpData').textContent);
    const main = $('#pdpMain');
    const thumbs = $('#pdpThumbs');
    const cta = $('#pdpCta');
    const url = (src, w) => `/images/${src}-${w}.webp`;
    const widths = (src) => (src.includes('-face') ? [800, 1400] : [800, 1600]);
    const setMain = (src, alt) => {
      const img = new Image();
      img.alt = alt;
      img.sizes = '(max-width: 900px) 100vw, 58vw';
      img.srcset = widths(src).map((w) => `${url(src, w)} ${w}w`).join(', ');
      img.src = url(src, 800);
      img.className = src.includes('-face') ? 'is-portrait' : '';
      main.appendChild(img);
      const old = $$('img', main).filter((i) => i !== img);
      gsap.fromTo(img, { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 0.9, ease: 'expo.inOut', onComplete: () => old.forEach((o) => o.remove()) });
    };
    const bindThumbs = () => {
      $$('button', thumbs).forEach((b) => b.addEventListener('click', () => {
        if (b.classList.contains('on')) return;
        $$('button', thumbs).forEach((x) => x.classList.toggle('on', x === b));
        setMain(b.dataset.src, b.getAttribute('aria-label'));
      }));
    };
    const setColour = (key, instant) => {
      const c = data.find((d) => d.key === key) || data[0];
      $$('#pdpSwatches button').forEach((b) => b.classList.toggle('on', b.dataset.key === c.key));
      $('#pdpColour').textContent = c.name;
      thumbs.innerHTML = c.views.map((v, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-src="${v.src}" aria-label="${v.label}"><img src="${url(v.src, 800)}" alt="" loading="lazy"><span>${v.label}</span></button>`).join('');
      bindThumbs();
      if (!instant) {
        setMain(c.views[0].src, c.name);
        gsap.from($$('button', thumbs), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out' });
      } else {
        const img = $('img', main);
        img.srcset = widths(c.views[0].src).map((w) => `${url(c.views[0].src, w)} ${w}w`).join(', ');
        img.src = url(c.views[0].src, 800);
      }
      const label = `${cta.dataset.pattern} — ${c.name}`;
      // Here the design goes into our quote list rather than to a contact page.
      cta.dataset.add = `designer-${cta.dataset.slug}-${c.key}`; cta.dataset.name = label; syncQuote();
      try { history.replaceState(null, '', `?c=${c.key}`); } catch (e) {}
    };
    bindThumbs();
    $$('#pdpSwatches button').forEach((b) => b.addEventListener('click', () => { if (!b.classList.contains('on')) setColour(b.dataset.key); }));
    const q = new URLSearchParams(location.search).get('c');
    if (q && q !== data[0].key) setColour(q, true);
  }

})();
