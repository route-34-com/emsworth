(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!window.gsap || !window.ScrollTrigger) {
    $('#loader').remove();
    $$('.loader__logo').forEach((el) => (el.style.cssText = 'clip-path:none;transform:none'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  body.classList.add('is-loading');

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else (typeof target === 'number' ? window.scrollTo(0, target) : target.scrollIntoView({ behavior: 'smooth' }));
  };
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id === '#top' ? 0 : $(id);
      if (el === null) return;
      e.preventDefault();
      body.classList.remove('menu-open');
      scrollTo(el);
    });
  });
  $('#burger').addEventListener('click', () => body.classList.toggle('menu-open'));

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
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 }),
    });
  });

  $$('textPath').forEach((t) => { t.setAttribute('textLength', '486'); t.setAttribute('lengthAdjust', 'spacing'); });

  /* ---------- cloth ---------- */
  const cloth = window.EmsworthCloth ? window.EmsworthCloth($('#cloth')) : null;

  /* ---------- loader + intro ---------- */
  const lp = $('#loaderPath');
  const len = lp.getTotalLength();
  gsap.set(lp, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set('.hero__title .line__in', { yPercent: 110 });
  gsap.set(['.hero__eyebrow', '.hero__lede', '.hero__ctas > *', '.hero__hint', '.hero__regions'], { autoAlpha: 0, y: 30 });
  gsap.set('.hero__badge', { scale: 0, rotate: -90 });
  gsap.set('.nav', { yPercent: -120 });

  const counter = { v: 0 };
  let loaded = document.readyState === 'complete';
  window.addEventListener('load', () => (loaded = true));
  const tl = gsap.timeline({ paused: true });
  tl.to(lp, { strokeDashoffset: 0, duration: reduce ? 0.2 : 2.1, ease: 'power2.inOut' }, 0)
    .to(counter, {
      v: 100, duration: reduce ? 0.2 : 2.2, ease: 'power3.inOut',
      onUpdate: () => ($('#loaderCount').textContent = String(Math.round(counter.v)).padStart(3, '0')),
    }, 0)
    .to('.loader__logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut' }, 1.1)
    .addPause('+=0.05', () => {
      const go = () => tl.play();
      if (loaded) go(); else { window.addEventListener('load', go, { once: true }); setTimeout(go, 3500); }
    })
    .to('.loader__inner', { autoAlpha: 0, y: -30, duration: 0.6, ease: 'power2.in' })
    .to('.loader__panel--top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.15')
    .to('.loader__panel--bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
    .add(() => {
      body.classList.remove('is-loading');
      if (lenis) lenis.start();
      if (cloth) {
        gsap.to(cloth.uniforms.uReveal, { value: 1, duration: 2.6, ease: 'power3.out' });
        setTimeout(() => cloth.pulse(0.62, 0.48), 700);
      }
    }, '<')
    .to('.hero__title .line__in', { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12 }, '<0.35')
    .to(['.hero__eyebrow', '.hero__lede', '.hero__ctas > *', '.hero__hint', '.hero__regions'], { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, '<0.3')
    .to('.hero__badge', { scale: 1, rotate: 0, duration: 1.4, ease: 'elastic.out(1,0.6)' }, '<0.1')
    .to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, '<')
    .add(() => $('#loader').remove());
  tl.play();

  /* hero scroll-out */
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (s) => { if (cloth) cloth.uniforms.uScroll.value = s.progress; },
  });
  gsap.to('.hero__content', { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });
  gsap.to('.hero__badge', { y: -160, rotate: 120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---------- magnetic buttons ---------- */
  if (fine) {
    $$('.magnetic').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.35);
        my((e.clientY - r.top - r.height / 2) * 0.45);
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,0.4)' }));
    });
  }

  /* ---------- nav + theme ---------- */
  const nav = $('#nav');
  let lastY = 0;
  const onScroll = (y) => {
    nav.classList.toggle('is-solid', y > 60);
    nav.classList.toggle('is-hidden', y > 300 && y > lastY && !body.classList.contains('menu-open'));
    lastY = y;
  };
  if (lenis) lenis.on('scroll', (l) => onScroll(l.scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

  $$('[data-theme-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => { if (s.isActive) body.dataset.theme = sec.dataset.themeSection; },
    });
  });

  /* ---------- pillars ---------- */
  gsap.from('.manifesto__pillars article', {
    y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.manifesto__pillars', start: 'top 85%' },
  });

  /* ---------- campaign ---------- */
  $$('.cimg').forEach((fig, i) => {
    const img = fig.querySelector('img');
    gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 88%' } })
      .to(fig, { clipPath: 'inset(0% 0 0 0 round 22px)', duration: 1.4, ease: 'expo.inOut', delay: (i % 2) * 0.12 })
      .to(img, { scale: 1.08, duration: 1.8, ease: 'expo.out' }, '<0.2');
    const sp = parseFloat(fig.dataset.speed || 0);
    gsap.fromTo(fig, { y: sp * 500 }, { y: -sp * 500, ease: 'none', scrollTrigger: { trigger: '.campaign__grid', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- library ---------- */
  gsap.from('.ltile', {
    y: 80, rotate: (i) => (i % 2 ? 3 : -3), autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: { each: 0.07, grid: 'auto', from: 'start' },
    scrollTrigger: { trigger: '.library__grid', start: 'top 85%' },
  });

  /* ---------- numbers ---------- */
  gsap.fromTo('.numbers__bg', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.numbers', start: 'top bottom', end: 'bottom top', scrub: true } });
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
  gsap.from('.stat', { y: 50, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.numbers__grid', start: 'top 85%' } });

  /* ---------- collections ---------- */
  const COLLECTIONS = [
    { name: 'Signature', tag: 'Flagship', gsm: '600+ GSM', v: 0.95, comp: '100% Combed Cotton', yarn: '2/20s Ring Spun', cons: '3-Pile Terry', for: 'Suites, presidential floors and spa.', img: 'assets/img/sw-signature.jpg' },
    { name: 'Zero-Twist', tag: 'New', gsm: '400–600 GSM', v: 0.78, comp: '100% Cotton', yarn: '10s · 14s · 16s', cons: 'Zero-Twist Terry', for: 'Untwisted loops that drink, not push, water.', img: 'assets/img/sw-zero.jpg' },
    { name: 'Classic', tag: 'Workhorse', gsm: '500+ GSM', v: 0.72, comp: '100% Carded Cotton', yarn: '16s Ring Spun', cons: 'Single Loop Terry', for: 'High-turnover four-star rooms. Chlorine tolerant.', img: 'assets/img/sw-classic.jpg' },
    { name: 'Essential', gsm: '400+ GSM', v: 0.55, comp: '100% Cotton', yarn: '10s Open End', cons: 'Single Cam Terry', for: 'Economy, staff and back-of-house. Honest weight.', img: 'assets/img/sw-essential.jpg' },
    { name: 'Organic', tag: 'GOTS', gsm: '550 GSM', v: 0.74, comp: '100% GOTS Organic Cotton', yarn: '16s Combed Ring Spun', cons: 'Double Loop Terry', for: 'Eco-positioned properties and EU/UK tenders.', img: 'assets/img/sw-organic.jpg' },
    { name: 'Bamboo-Cotton', gsm: '500–650 GSM', v: 0.8, comp: 'Bamboo · Cotton blend', yarn: 'Fluid drape, soft sheen', cons: 'Terry', for: 'Spa, wellness and premium suites.', img: 'assets/img/sw-bamboo.jpg' },
    { name: 'Cabana Pool', tag: 'Yarn-dyed', gsm: '550 GSM', v: 0.74, comp: '100% Cotton', yarn: '16s Ring Spun', cons: 'Yarn-Dyed Terry', for: 'Pool, beach club and gym. Stripe survives chlorine.', img: 'assets/img/sw-cabana.jpg' },
    { name: 'Spa Colour', gsm: '550 GSM', v: 0.74, comp: '100% Cotton', yarn: '16s Ring Spun', cons: 'Piece-Dyed Terry', for: 'Treatment rooms, where white reads clinical.', img: 'assets/img/sw-spa.jpg' },
  ];
  const track = $('#colTrack');
  COLLECTIONS.forEach((c) => {
    const card = document.createElement('article');
    card.className = 'ccard';
    card.innerHTML = `<div class="ccard__swatch"><img src="${c.img}" alt="${c.name} towel" loading="lazy">${c.tag ? `<span class="ccard__tag">${c.tag}</span>` : ''}</div>
      <div class="ccard__body"><h3>${c.name}</h3><p class="ccard__gsm">${c.gsm}</p>
      <dl><dt>Fibre</dt><dd>${c.comp}</dd><dt>Yarn</dt><dd>${c.yarn}</dd><dt>Build</dt><dd>${c.cons}</dd></dl>
      <div class="ccard__bar" style="--v:${c.v}"><i></i></div><p class="ccard__for">${c.for}</p></div>`;
    track.appendChild(card);
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', () => {
    const pinEl = $('.collections__pin');
    const dist = () => Math.max(0, track.scrollWidth - (pinEl.clientWidth - track.offsetLeft) + 40);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pinEl, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => {
          gsap.set('#colProgress', { scaleX: s.progress });
          const k = gsap.utils.clamp(0, 1, s.progress * 3.2);
          gsap.set('.collections__intro', { opacity: 1 - k * 0.92, x: -k * 80, filter: `blur(${k * 4}px)` });
        },
      },
    });
    $$('.ccard').forEach((card) => {
      gsap.fromTo(card, { rotateY: -25, y: 60, autoAlpha: 0.3 }, {
        rotateY: 0, y: 0, autoAlpha: 1, ease: 'power2.out',
        scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left 105%', end: 'left 65%', scrub: true, onEnter: () => card.classList.add('in') },
      });
    });
    return () => $$('.ccard').forEach((c) => c.classList.add('in'));
  });
  mm.add('(max-width: 820px)', () => {
    $$('.ccard').forEach((c) => c.classList.add('in'));
  });
  if (fine) {
    $$('.ccard').forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - 0.5) * -10);
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    gsap.set('.collections__track', { perspective: 1200 });
  }

  /* ---------- portfolio list ---------- */
  (function () {
    const fl = $('#plistFloat');
    if (!fine) return;
    const img = fl.querySelector('img');
    const xTo = gsap.quickTo(fl, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(fl, 'y', { duration: 0.7, ease: 'power3' });
    const rTo = gsap.quickTo(fl, 'rotation', { duration: 0.8, ease: 'power3' });
    let lx = 0, px = -1, py = -1, current = null;
    const show = (li) => {
      if (li === current) return;
      current = li;
      if (!li) { gsap.to(fl, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: 'power3.in', overwrite: 'auto' }); return; }
      if (img.getAttribute('src') !== li.dataset.img) {
        img.src = li.dataset.img;
        gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 0.9, ease: 'expo.out' });
      }
      gsap.to(fl, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    };
    const check = () => {
      if (px < 0) return;
      const el = document.elementFromPoint(px, py);
      show(el && el.closest ? el.closest('#plist li') : null);
    };
    window.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      xTo(px - fl.offsetWidth * 0.5);
      yTo(py - fl.offsetHeight * 0.55);
      rTo(gsap.utils.clamp(-14, 14, (px - lx) * 0.6));
      lx = px;
      check();
    }, { passive: true });
    if (lenis) lenis.on('scroll', check);
    else window.addEventListener('scroll', check, { passive: true });
    document.addEventListener('pointerleave', () => show(null));
  })();
  gsap.from('#plist li', { y: 50, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '#plist', start: 'top 85%' } });
  $$('#plist li').forEach((li) => li.addEventListener('click', () => scrollTo($('#contact'))));

  /* ---------- studio ---------- */
  const studio = (function () {
    const svg = $('#towel');
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

    function render(animate) {
      const maxW = 320, maxH = 540;
      const sc = Math.min(maxW / state.w, maxH / state.h);
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
      if (animate) {
        gsap.fromTo('#towelBody', { scaleY: 0.96, scaleX: 1.03, transformOrigin: '50% 0%' }, { scaleY: 1, scaleX: 1, duration: 1.2, ease: 'elastic.out(1,0.35)' });
      }
    }

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

    return {
      summary() {
        const sizeName = $('.seg[data-key="size"] .on').textContent;
        const borderName = $('.seg[data-key="border"] .on').textContent;
        return `Sample request — ${$('#specCode').textContent}\n${sizeName} · ${state.colourName} · ${state.gsm} GSM (${tier(state.gsm)[1]}) · ${borderName} border${state.text ? ` · Embroidered "${state.text}"` : ''}\n\nRooms / quantity: `;
      },
    };
  })();

  $('#sendSpec').addEventListener('click', () => {
    const msg = $('#fMsg');
    msg.value = studio.summary();
    const chip = $$('#fCats button')[0];
    chip.classList.add('on');
    scrollTo($('#contact'));
    setTimeout(() => { msg.focus({ preventScroll: true }); gsap.fromTo(msg.parentElement, { backgroundColor: 'rgba(198,165,122,.35)' }, { backgroundColor: 'rgba(198,165,122,0)', duration: 2 }); }, 1500);
  });

  /* ---------- process ---------- */
  mm.add('(min-width: 901px)', () => {
    const line = $('#procLine');
    const L = line.getTotalLength();
    gsap.set(line, { strokeDasharray: L, strokeDashoffset: L });
    const steps = $$('#procSteps li');
    const svgEl = $('.process__svg');
    const place = () => {
      const sr = svgEl.getBoundingClientRect();
      steps.forEach((li) => {
        const lx = li.getBoundingClientRect().left + 8 - sr.left;
        const fx = (lx / sr.width) * 1600;
        let lo = 0, hi = L;
        for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (line.getPointAtLength(mid).x < fx) lo = mid; else hi = mid; }
        const pt = line.getPointAtLength(lo);
        li.style.setProperty('--dot', (pt.y / 400) * sr.height + 'px');
        li.style.paddingTop = sr.height + 34 + 'px';
        li.dataset.at = lo / L;
      });
    };
    place();
    ScrollTrigger.addEventListener('refreshInit', place);
    gsap.to(line, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: {
        trigger: '.process__pin', start: 'top top', end: '+=1800', pin: true, scrub: 0.6,
        onUpdate: (s) => steps.forEach((li) => li.classList.toggle('on', s.progress >= +li.dataset.at - 0.02)),
      },
    });
    return () => ScrollTrigger.removeEventListener('refreshInit', place);
  });
  mm.add('(max-width: 900px)', () => {
    $$('#procSteps li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 85%', onEnter: () => li.classList.add('on') }));
  });

  /* ---------- seals ---------- */
  gsap.from('.seal', { scale: 0.4, rotate: -120, autoAlpha: 0, duration: 1.6, stagger: 0.12, ease: 'elastic.out(1,0.6)', scrollTrigger: { trigger: '.seals', start: 'top 85%' } });

  /* ---------- map ---------- */
  (function () {
    const cv = $('#mapCanvas');
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
    const HUB = { n: 'Jebel Ali · Dubai', s: 'Emsworth hub', lon: 55.0, lat: 25.0, big: true };
    const MILL = { n: 'Tiruchengode', s: 'Christy mill', lon: 77.9, lat: 11.4, big: true };
    const DEST = [
      { n: 'Riyadh', lon: 46.7, lat: 24.7, a: 'l' }, { n: 'Doha', lon: 51.5, lat: 25.3, hide: true }, { n: 'Muscat', lon: 58.4, lat: 23.6, a: 'b' },
      { n: 'Kuwait', lon: 47.9, lat: 29.4 }, { n: 'Manama', lon: 50.6, lat: 26.2, hide: true }, { n: 'Jeddah', lon: 39.2, lat: 21.5, a: 'l' },
      { n: 'Cairo', lon: 31.2, lat: 30.0, a: 'l' }, { n: 'Nairobi', lon: 36.8, lat: -1.3 }, { n: 'Addis Ababa', lon: 38.7, lat: 9.0 }, { n: 'Mombasa', lon: 39.7, lat: -4.0, hide: true },
    ];
    HUB.a = 't';
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
    function layout() {
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
        if (d === MILL) el.style.transform = 'translate(calc(-100% + 10px), 16px)';
        if (d === MILL) el.style.textAlign = 'right';
        if (d.a === 'l') el.style.transform = 'translate(calc(-100% - 10px), -50%)';
        if (d.a === 'b') el.style.transform = 'translate(-30%, 10px)';
        if (d.a === 't') el.style.transform = 'translate(-20%, calc(-100% - 14px))';
        labels.appendChild(el);
        d.el = el;
      });
    }
    const arc = (a, b, t, lift) => {
      const [x1, y1] = proj(a.lon, a.lat), [x2, y2] = proj(b.lon, b.lat);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * lift;
      const pts = [];
      for (let i = 0; i <= 40 * t; i++) {
        const u = i / 40;
        pts.push([(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2]);
      }
      return pts;
    };
    const at = (a, b, u, lift) => {
      const [x1, y1] = proj(a.lon, a.lat), [x2, y2] = proj(b.lon, b.lat);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * lift;
      return [(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2];
    };
    let visible = false, time = 0;
    function draw() {
      if (!visible) return;
      time += 0.016;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      dots.forEach(([x, y, land]) => {
        ctx.fillStyle = land ? 'rgba(255,237,224,.42)' : 'rgba(255,237,224,.07)';
        ctx.beginPath(); ctx.arc(x, y, land ? 1.6 : 1, 0, Math.PI * 2); ctx.fill();
      });
      const p1 = gsap.utils.clamp(0, 1, state.p * 2.2);
      const line = (pts, color, w) => { if (pts.length < 2) return; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
      line(arc(MILL, HUB, p1, 0.35), '#C6A57A', 2.4);
      DEST.forEach((d, i) => {
        const t = gsap.utils.clamp(0, 1, (state.p - 0.4 - i * 0.03) * 4);
        line(arc(HUB, d, t, 0.25), 'rgba(239,205,178,.75)', 1.2);
        if (d.el) d.el.style.opacity = t > 0.95 ? 1 : 0;
        if (t >= 1) {
          const u = ((time * 0.35 + i * 0.13) % 1);
          const [x, y] = at(HUB, d, u, 0.25);
          ctx.fillStyle = '#FFEDE0'; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
          const [ex, ey] = proj(d.lon, d.lat);
          ctx.fillStyle = '#EFCDB2'; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
        }
      });
      if (p1 >= 1) {
        const u = (time * 0.25) % 1;
        const [x, y] = at(MILL, HUB, u, 0.35);
        ctx.fillStyle = '#FFEDE0'; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      }
      [MILL, HUB].forEach((d) => {
        const [x, y] = proj(d.lon, d.lat);
        const pulse = (time * 0.8) % 1;
        ctx.strokeStyle = `rgba(198,165,122,${1 - pulse})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 5 + pulse * 22, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#C6A57A'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        if (d.el) d.el.style.opacity = state.p > 0.05 ? 1 : 0;
      });
      requestAnimationFrame(draw);
    }
    layout();
    new IntersectionObserver((en) => { const was = visible; visible = en[0].isIntersecting; if (visible && !was) draw(); }).observe(cv);
    window.addEventListener('resize', () => layout());
    ScrollTrigger.create({ trigger: '.reach__map', start: 'top 80%', once: true, onEnter: () => gsap.to(state, { p: 1, duration: 4.5, ease: 'power2.inOut' }) });
  })();
  gsap.from('.reach__list li', { x: -30, autoAlpha: 0, stagger: 0.07, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.reach__list', start: 'top 85%' } });

  /* ---------- contact ---------- */
  const cp = $('#contactPath');
  const cl = cp.getTotalLength();
  gsap.fromTo(cp, { strokeDasharray: cl, strokeDashoffset: cl }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 80%', end: 'center 40%', scrub: 1 } });
  gsap.from('.contact__form > *', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.contact__form', start: 'top 80%' } });
  $$('#fCats button').forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#fName'), mail = $('#fMail');
    let ok = true;
    [name, mail].forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.parentElement.classList.toggle('err', bad);
      if (bad) { ok = false; gsap.fromTo(f.parentElement, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,0.3)' }); }
    });
    if (!ok) return;
    const cats = $$('#fCats .on').map((b) => b.textContent).join(', ');
    const bodyTxt = `Name: ${name.value}\nProperty / company: ${$('#fCo').value}\nEmail: ${mail.value}\nCategories: ${cats || '-'}\n\n${$('#fMsg').value}`;
    const subject = `Enquiry — ${$('#fCo').value || name.value}`;
    window.location.href = `mailto:info@emsworthhospitality.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
    $('#formOk').classList.add('show');
  });

  /* ---------- footer ---------- */
  gsap.from('.footer__word img', { yPercent: 100, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  window.addEventListener('load', () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
})();
