(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EMAIL = 'info@emsworthhospitality.com';

  if (!window.gsap || !window.ScrollTrigger) {
    const l = $('#loader');
    if (l) l.remove();
    const c = $('#curtain');
    if (c) c.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else if (typeof target === 'number') window.scrollTo(0, target);
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- page transitions ---------- */
  const curtain = $('#curtain');
  const leave = (href) => {
    if (reduce || !curtain) { window.location.href = href; return; }
    try { sessionStorage.setItem('emsTrans', '1'); } catch (e) {}
    if (lenis) lenis.stop();
    gsap.timeline({ onComplete: () => (window.location.href = href) })
      .set(curtain, { display: 'grid', yPercent: 100, borderRadius: '50% 50% 0 0 / 14% 14% 0 0' })
      .to('main, .footer', { y: -60, autoAlpha: 0.4, duration: 0.9, ease: 'power3.inOut' }, 0)
      .to(curtain, { yPercent: 0, borderRadius: '0% 0% 0 0 / 0% 0% 0 0', duration: 0.9, ease: 'power3.inOut' }, 0)
      .fromTo(curtain.querySelector('svg'), { autoAlpha: 0, scale: 0.8, rotate: -10 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith('#')) {
      const el = href === '#top' ? 0 : $(href);
      if (el === null) return;
      e.preventDefault();
      body.classList.remove('menu-open');
      scrollTo(el);
      return;
    }
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    e.preventDefault();
    body.classList.remove('menu-open');
    leave(url.href);
  });
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    if (curtain) gsap.set(curtain, { display: 'none' });
    gsap.set('main, .footer', { clearProps: 'transform,opacity,visibility' });
    document.documentElement.classList.remove('is-trans');
    if (lenis) lenis.start();
  });

  const $burger = $('#burger');
  if ($burger) $burger.addEventListener('click', () => body.classList.toggle('menu-open'));

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

  /* ---------- intro: home loader or page curtain ---------- */
  const cloth = window.EmsworthCloth && $('#cloth') ? window.EmsworthCloth($('#cloth')) : null;
  const heroIn = () => {
    if ($('.hero')) {
      gsap.timeline()
        .add(() => {
          if (cloth) {
            gsap.to(cloth.uniforms.uReveal, { value: 1, duration: 2.6, ease: 'power3.out' });
            setTimeout(() => cloth.pulse(0.62, 0.48), 700);
          }
        })
        .to('.hero__title .line__in', { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12 }, 0.2)
        .to(['.hero__eyebrow', '.hero__lede', '.hero__ctas > *', '.hero__hint', '.hero__regions'], { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, '<0.3')
        .to('.hero__badge', { scale: 1, rotate: 0, duration: 1.4, ease: 'elastic.out(1,0.6)' }, '<0.1')
        .to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, '<');
    }
    if ($('.phero')) {
      gsap.timeline()
        .fromTo('.phero__media img', { scale: 1.25 }, { scale: 1.05, duration: 2.2, ease: 'expo.out' }, 0)
        .from(['.crumbs', '.phero__kicker', '.phero__title', '.phero__lede'], { y: 50, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }, 0.15);
    }
    if ($('.pdp')) {
      gsap.timeline()
        .from('.pdp__main', { clipPath: 'inset(100% 0 0 0 round 24px)', duration: 1.3, ease: 'expo.inOut' }, 0)
        .from('.pdp__info > *', { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, 0.3)
        .from('.pdp__thumbs button', { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 0.5);
    }
  };

  if ($('.hero')) {
    gsap.set('.hero__title .line__in', { yPercent: 110 });
    gsap.set(['.hero__eyebrow', '.hero__lede', '.hero__ctas > *', '.hero__hint', '.hero__regions'], { autoAlpha: 0, y: 30 });
    gsap.set('.hero__badge', { scale: 0, rotate: -90 });
  }

  let pendingEnter = null;
  let fromTransition = false;
  try { fromTransition = sessionStorage.getItem('emsTrans') === '1'; sessionStorage.removeItem('emsTrans'); } catch (e) {}
  const loaderEl = $('#loader');

  if (loaderEl && !fromTransition) {
    body.classList.add('is-loading');
    if (lenis) lenis.stop();
    gsap.set('.nav', { yPercent: -120 });
    const lp = $('#loaderPath');
    const len = lp.getTotalLength();
    gsap.set(lp, { strokeDasharray: len, strokeDashoffset: len });
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
        heroIn();
      }, '<0.2')
      .add(() => loaderEl.remove());
    tl.play();
  } else {
    if (loaderEl) loaderEl.remove();
    if (curtain && fromTransition && !reduce) {
      gsap.set(curtain, { display: 'grid', yPercent: 0 });
      pendingEnter = () => {
        const img = $('.phero__media img, .pdp__main img');
        const decoded = img && img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        Promise.race([decoded, new Promise((r) => setTimeout(r, 900))]).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
          gsap.timeline({ onComplete: () => { gsap.set(curtain, { display: 'none', clearProps: 'borderRadius' }); document.documentElement.classList.remove('is-trans'); } })
            .to(curtain.querySelector('svg'), { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' })
            .to(curtain, { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 14% 14%', duration: 1.1, ease: 'power3.inOut' }, '-=0.1')
            .add(heroIn, '-=0.7');
        })));
      };
    } else {
      document.documentElement.classList.remove('is-trans');
      heroIn();
    }
  }

  /* ---------- home hero scroll-out ---------- */
  if ($('.hero')) {
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2,
      onUpdate: (s) => { if (cloth) cloth.uniforms.uScroll.value = s.progress; },
    });
    gsap.to('.hero__content', { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: 1.2 } });
    gsap.to('.hero__badge', { y: -160, rotate: 120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
  }

  /* ---------- page hero parallax ---------- */
  if ($('.phero')) {
    gsap.to('.phero__media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.phero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
    gsap.to('.phero__content', { yPercent: -25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.phero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
  }

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

  /* ---------- generic reveals ---------- */
  const reveal = (sel, trigger, vars = {}) => {
    if (!$(sel)) return;
    gsap.from(sel, Object.assign({ y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: trigger || sel, start: 'top 86%' } }, vars));
  };
  reveal('.manifesto__pillars article', '.manifesto__pillars');
  reveal('.intro2__facts > div', '.intro2__facts');
  reveal('.hl__item', '.hl');
  reveal('.specs__row', '.specs', { y: 20, stagger: 0.05 });
  reveal('.opt', '.options__grid');
  reveal('.more__card', '.more__grid');
  reveal('.cinfo article', '.cinfo');
  reveal('.story__cols p', '.story__cols');
  reveal('.ctaband__inner > p, .ctaband__inner > .btn', '.ctaband');
  $$('.catcard').forEach((c) => {
    gsap.from(c.querySelector('.catcard__media'), { clipPath: 'inset(0 0 100% 0 round 24px)', y: 40, duration: 1.9, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 90%' } });
    gsap.from(c.querySelector('.catcard__media img'), { scale: 1.25, duration: 2.4, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 90%' } });
    gsap.from(c.querySelector('.catcard__body'), { y: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.3, scrollTrigger: { trigger: c, start: 'top 85%' } });
    gsap.fromTo(c.querySelector('img'), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  });
  $$('.feature').forEach((f) => {
    gsap.from(f.querySelector('.feature__media'), { clipPath: 'inset(0 100% 0 0 round 24px)', duration: 1.9, ease: 'power3.out', scrollTrigger: { trigger: f, start: 'top 85%' } });
    gsap.from(f.querySelector('.feature__media img'), { scale: 1.25, duration: 2.4, ease: 'power2.out', scrollTrigger: { trigger: f, start: 'top 85%' } });
    gsap.from(f.querySelectorAll('.feature__copy p'), { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 75%' } });
  });
  if ($('.ctaband__loop')) {
    const p = $('.ctaband__loop');
    gsap.fromTo(p, { rotate: -20, y: 80 }, { rotate: 10, y: -80, ease: 'none', scrollTrigger: { trigger: '.ctaband', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  }

  /* ---------- campaign ---------- */
  $$('.cimg').forEach((fig, i) => {
    const img = fig.querySelector('img');
    gsap.set(fig, { y: 40 });
    gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 92%' }, delay: (i % 2) * 0.15 })
      .to(fig, { clipPath: 'inset(0% 0 0 0 round 22px)', y: 0, duration: 1.9, ease: 'power3.out' })
      .fromTo(img, { scale: 1.28 }, { scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0);
    const sp = parseFloat(fig.dataset.speed || 0);
    gsap.fromTo(fig, { yPercent: sp * 60 }, { yPercent: -sp * 60, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.campaign__grid', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  });

  /* ---------- library ---------- */
  if ($('.ltile')) {
    gsap.from('.ltile', {
      y: 60, autoAlpha: 0, duration: 1.6, ease: 'power3.out', stagger: { each: 0.09, from: 'start' },
      scrollTrigger: { trigger: '.library__grid', start: 'top 85%' },
    });
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

  const mm = gsap.matchMedia();

  /* ---------- tier cards (horizontal pin) ---------- */
  const track = $('#colTrack');
  if (track) {
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
          scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left 105%', end: 'left 65%', scrub: 1.2, onEnter: () => card.classList.add('in') },
        });
      });
      return () => $$('.ccard').forEach((c) => c.classList.add('in'));
    });
    mm.add('(max-width: 820px)', () => { $$('.ccard').forEach((c) => c.classList.add('in')); });
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
      gsap.set(track, { perspective: 1200 });
    }
  }

  /* ---------- portfolio list ---------- */
  if ($('#plist')) {
    const fl = $('#plistFloat');
    if (fine && fl) {
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
    }
    reveal('#plist li', '#plist', { y: 50 });
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
      leave('/contact/?c=' + encodeURIComponent('Bath linen'));
    });
  }

  /* ---------- process ---------- */
  if ($('#procLine')) {
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
  }

  /* ---------- seals ---------- */
  if ($('.seal')) gsap.from('.seal', { scale: 0.4, rotate: -120, autoAlpha: 0, duration: 1.6, stagger: 0.12, ease: 'elastic.out(1,0.6)', scrollTrigger: { trigger: '.seals', start: 'top 85%' } });

  /* ---------- map ---------- */
  if ($('#mapCanvas')) {
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
          const [x, y] = bez(HUB, d, (time * 0.35 + i * 0.13) % 1, 0.25);
          ctx.fillStyle = '#FFEDE0'; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
          const [ex, ey] = proj(d.lon, d.lat);
          ctx.fillStyle = '#EFCDB2'; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
        }
      });
      if (p1 >= 1) {
        const [x, y] = bez(MILL, HUB, (time * 0.25) % 1, 0.35);
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
    };
    layout();
    new IntersectionObserver((en) => { const was = visible; visible = en[0].isIntersecting; if (visible && !was) draw(); }).observe(cv);
    window.addEventListener('resize', layout);
    ScrollTrigger.create({ trigger: '.reach__map', start: 'top 80%', once: true, onEnter: () => gsap.to(state, { p: 1, duration: 4.5, ease: 'power2.inOut' }) });
    reveal('.reach__list li', '.reach__list', { x: -30, y: 0, stagger: 0.07 });
  }

  /* ---------- gallery + lightbox ---------- */
  if ($('.gtile')) {
    $$('.gtile').forEach((t, i) => {
      gsap.from(t, { clipPath: 'inset(100% 0 0 0 round 18px)', y: 30, duration: 1.7, ease: 'power3.out', delay: (i % 3) * 0.12, scrollTrigger: { trigger: t, start: 'top 94%' } });
      gsap.from(t.querySelector('img'), { scale: 1.25, duration: 2.2, ease: 'power2.out', delay: (i % 3) * 0.12, scrollTrigger: { trigger: t, start: 'top 94%' } });
    });
    const tiles = $$('.gtile');
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lightbox__close" aria-label="Close">×</button><button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">←</button><figure><img alt=""><figcaption></figcaption></figure><button class="lightbox__nav lightbox__nav--next" aria-label="Next">→</button>';
    body.appendChild(lb);
    const lbImg = $('img', lb), lbCap = $('figcaption', lb);
    let idx = 0;
    const showLb = (i) => {
      idx = (i + tiles.length) % tiles.length;
      lbImg.src = tiles[idx].dataset.full;
      lbImg.alt = tiles[idx].dataset.alt || '';
      lbCap.textContent = tiles[idx].dataset.alt || '';
      gsap.fromTo(lbImg, { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out' });
    };
    const open = (i) => { lb.classList.add('open'); if (lenis) lenis.stop(); showLb(i); };
    const close = () => { lb.classList.remove('open'); if (lenis) lenis.start(); };
    tiles.forEach((t, i) => t.addEventListener('click', () => open(i)));
    $('.lightbox__close', lb).addEventListener('click', close);
    $('.lightbox__nav--prev', lb).addEventListener('click', () => showLb(idx - 1));
    $('.lightbox__nav--next', lb).addEventListener('click', () => showLb(idx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showLb(idx - 1);
      if (e.key === 'ArrowRight') showLb(idx + 1);
    });
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
      cta.href = `/contact/?design=${encodeURIComponent(label)}`;
      try { history.replaceState(null, '', `?c=${c.key}`); } catch (e) {}
    };
    bindThumbs();
    $$('#pdpSwatches button').forEach((b) => b.addEventListener('click', () => { if (!b.classList.contains('on')) setColour(b.dataset.key); }));
    const q = new URLSearchParams(location.search).get('c');
    if (q && q !== data[0].key) setColour(q, true);
  }

  /* ---------- contact ---------- */
  if ($('#contactForm')) {
    const cp = $('#contactPath');
    const cl = cp.getTotalLength();
    gsap.fromTo(cp, { strokeDasharray: cl, strokeDashoffset: cl }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 80%', end: 'center 40%', scrub: 1 } });
    gsap.from('.contact__form > *', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.contact__form', start: 'top 85%' } });
    $$('#fCats button').forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));

    const params = new URLSearchParams(location.search);
    const msg = $('#fMsg');
    const pick = (label) => $$('#fCats button').forEach((b) => { if (b.textContent.toLowerCase() === label.toLowerCase()) b.classList.add('on'); });
    let spec = null;
    try { spec = sessionStorage.getItem('emsSpec'); sessionStorage.removeItem('emsSpec'); } catch (e) {}
    if (spec) msg.value = spec;
    if (params.get('design')) { msg.value = `Design: ${params.get('design')}\n\nQuantities / sizes: `; pick('Designer Collection'); }
    if (params.get('c')) pick(params.get('c'));
    if (msg.value) gsap.fromTo(msg.parentElement, { backgroundColor: 'rgba(198,165,122,.35)' }, { backgroundColor: 'rgba(198,165,122,0)', duration: 2.5, delay: 1 });

    $('#contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#fName'), mail = $('#fMail');
      let ok = true;
      [name, mail].forEach((fld) => {
        const bad = !fld.value.trim() || (fld.type === 'email' && !/^\S+@\S+\.\S+$/.test(fld.value));
        fld.parentElement.classList.toggle('err', bad);
        if (bad) { ok = false; gsap.fromTo(fld.parentElement, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,0.3)' }); }
      });
      if (!ok) return;
      const cats = $$('#fCats .on').map((b) => b.textContent).join(', ');
      const bodyTxt = `Name: ${name.value}\nProperty / company: ${$('#fCo').value}\nEmail: ${mail.value}\nCategories: ${cats || '-'}\n\n${msg.value}`;
      const subject = `Enquiry — ${$('#fCo').value || name.value}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
      $('#formOk').classList.add('show');
    });
  }

  /* ---------- footer ---------- */
  gsap.from('.footer__word img', { yPercent: 100, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%' } });

  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  if (pendingEnter) pendingEnter();
  window.addEventListener('load', () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
})();
