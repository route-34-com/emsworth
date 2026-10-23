// Justified rows: every photo keeps its own shape (nothing is cropped) and each row is scaled to fill the width exactly.
// Children carry data-ar (width / height). The row breaks are chosen so row heights stay close to the target.

type Opts = { target: () => number; maxPerRow?: () => number };

export function justify(box: HTMLElement, { target, maxPerRow = () => 5 }: Opts) {
  const items = [...box.children].filter((el) => !(el as HTMLElement).hidden && (el as HTMLElement).dataset.ar) as HTMLElement[];
  const W = box.clientWidth;
  const n = items.length;
  if (!n || !W) return;
  const gap = parseFloat(getComputedStyle(box).columnGap) || 0;
  const ar = items.map((el) => parseFloat(el.dataset.ar!));
  const t = target();
  const max = maxPerRow();

  // Best[j]: least cost to lay out the first j photos; a row that comes out taller than the target costs more than a short one.
  const best = new Array(n + 1).fill(Infinity);
  const from = new Array(n + 1).fill(0);
  best[0] = 0;
  for (let j = 1; j <= n; j++) {
    let sum = 0;
    for (let i = j - 1; i >= 0 && j - i <= max; i--) {
      sum += ar[i];
      const h = (W - gap * (j - i - 1)) / sum;
      const c = best[i] + (h > t ? 1.6 : 1) * (h - t) ** 2;
      if (c < best[j]) { best[j] = c; from[j] = i; }
    }
  }
  const rows: [number, number][] = [];
  for (let j = n; j > 0; j = from[j]) rows.unshift([from[j], j]);

  for (const [a, b] of rows) {
    const sum = ar.slice(a, b).reduce((x, y) => x + y, 0);
    const m = b - a;
    // A lone row that would come out far too tall (one or two photos) is capped and left-aligned instead.
    const h = (W - gap * (m - 1)) / sum;
    const cap = h > t * 1.5 ? (t * 1.5 * sum + gap * (m - 1)) / W : 1;
    for (let k = a; k < b; k++) {
      items[k].style.width = `calc((${(cap * 100).toFixed(4)}% - ${gap * (m - 1) + 0.5}px) * ${(ar[k] / sum).toFixed(6)})`;
    }
  }
}

/** Lays out every matching box now and again whenever its width changes. */
export function justifyAll(selector: string, opts: Opts) {
  const boxes = [...document.querySelectorAll<HTMLElement>(selector)];
  const widths = new WeakMap<HTMLElement, number>();
  const ro = new ResizeObserver((es) => es.forEach((e) => {
    const box = e.target as HTMLElement;
    if (widths.get(box) === box.clientWidth) return;
    widths.set(box, box.clientWidth);
    justify(box, opts);
  }));
  boxes.forEach((b) => { justify(b, opts); ro.observe(b); });
  return (box: HTMLElement) => justify(box, opts);
}
