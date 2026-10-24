// Site behaviour: header state, mobile menu, reveal on scroll, quote list,
// gallery lightbox and the design switcher.

const $ = <T extends Element>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

// Header: solid once the hero has scrolled away; burger toggles the panel.
const hdr = $<HTMLElement>('[data-hdr]')!;
const onScroll = () => hdr.classList.toggle('hdr--solid', scrollY > 60);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const burger = $<HTMLButtonElement>('[data-burger]')!;
const panel = $<HTMLElement>('[data-panel]')!;
burger.addEventListener('click', () => {
  const open = panel.hidden;
  panel.hidden = !open;
  hdr.classList.toggle('hdr--open', open);
  burger.setAttribute('aria-expanded', String(open));
});

// Reveal
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach((el) => io.observe(el));

// Quote list (kept in this browser; the form on /request-a-quote/ reads it).
export type QuoteItem = { id: string; name: string; group: string };
const KEY = 'emsworth-quote';
export const readQuote = (): QuoteItem[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const writeQuote = (l: QuoteItem[]) => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* storage blocked */ } };
const toast = $<HTMLElement>('[data-toast]')!;
let toastT = 0;
const say = (html: string) => {
  toast.innerHTML = html; toast.classList.add('show');
  clearTimeout(toastT); toastT = window.setTimeout(() => toast.classList.remove('show'), 2600);
};
export function syncQuote() {
  const l = readQuote();
  $$('[data-count]').forEach((el) => (el.textContent = String(l.length)));
  $$<HTMLButtonElement>('[data-add]').forEach((b) => {
    const on = l.some((x) => x.id === b.dataset.add);
    b.classList.toggle('added', on);
    b.textContent = on ? '✓ In your quote' : '+ Add to quote';
  });
}
/** Adds an item from code (e.g. the towel studio's spec) and says so; does nothing if it is already there. */
export function addToQuote(item: QuoteItem) {
  const l = readQuote();
  if (!l.some((x) => x.id === item.id)) { l.push(item); writeQuote(l); syncQuote(); }
  say(`Added ${item.name} · <a href="/request-a-quote/">View quote</a>`);
}
document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-add]');
  if (!b) return;
  let l = readQuote();
  const id = b.dataset.add!;
  if (l.some((x) => x.id === id)) { l = l.filter((x) => x.id !== id); say(`Removed ${b.dataset.name}`); }
  else { l.push({ id, name: b.dataset.name!, group: b.dataset.group || '' }); say(`Added ${b.dataset.name} · <a href="/request-a-quote/">View quote</a>`); }
  writeQuote(l); syncQuote();
});
syncQuote();

// Lightbox: any [data-gallery] container whose links point at full-size images.
const lb = $<HTMLDialogElement>('[data-lb]')!;
const lbImg = $<HTMLImageElement>('[data-lb-img]')!;
const lbCap = $<HTMLElement>('[data-lb-cap]')!;
let set: HTMLAnchorElement[] = [];
let at = 0;
const show = (i: number) => {
  at = (i + set.length) % set.length;
  const a = set[at];
  lbImg.src = a.href;
  lbImg.alt = a.querySelector('img')?.alt || '';
  lbCap.textContent = a.dataset.cap || ''; // never a photo count
};
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('[data-gallery] a[data-full]');
  if (!a) return;
  e.preventDefault();
  set = $$<HTMLAnchorElement>('a[data-full]', a.closest('[data-gallery]')!).filter((x) => !x.hidden);
  show(set.indexOf(a));
  lb.showModal();
});
$('[data-lb-close]')!.addEventListener('click', () => lb.close());
$('[data-lb-prev]')!.addEventListener('click', () => show(at - 1));
$('[data-lb-next]')!.addEventListener('click', () => show(at + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(at - 1);
  if (e.key === 'ArrowRight') show(at + 1);
});
let tx = 0;
lb.addEventListener('touchstart', (e) => (tx = e.touches[0].clientX), { passive: true });
lb.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
});

// Design switcher
const root = document.documentElement;
const DKEY = 'emsworth-design';
const dsPanel = $<HTMLElement>('[data-ds-panel]')!;
const dsToggle = $<HTMLButtonElement>('[data-ds-toggle]')!;
const paint = () => $$<HTMLElement>('[data-ds-group]').forEach((g) => {
  const k = g.dataset.dsGroup!;
  $$<HTMLButtonElement>('button', g).forEach((b) => b.setAttribute('aria-pressed', String(root.dataset[k] === b.dataset.v)));
});
dsToggle.addEventListener('click', () => {
  dsPanel.hidden = !dsPanel.hidden;
  dsToggle.setAttribute('aria-expanded', String(!dsPanel.hidden));
});
$$<HTMLElement>('[data-ds-group]').forEach((g) => g.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('button[data-v]');
  if (!b) return;
  root.dataset[g.dataset.dsGroup!] = b.dataset.v!;
  try { localStorage.setItem(DKEY, JSON.stringify({ palette: root.dataset.palette })); } catch { /* storage blocked */ }
  paint();
}));
paint();
