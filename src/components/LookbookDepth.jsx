// Lookbook landing: every product as a card in the ReactBits Depth Carousel. The product in front is named underneath;
// clicking it (or "Open") goes to that product.
import { useEffect, useState } from 'react';
import DepthCarousel from './reactbits/DepthCarousel.jsx';

export default function LookbookDepth({ items }) {
  const [active, setActive] = useState(0);
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  const small = w < 760;
  const it = items[active];
  return (
    <div className="lbd" key={small ? 's' : 'b'}>
      <div className="lbd__stage">
        <DepthCarousel
          items={items.map((p) => ({ image: p.image, alt: p.name, focus: p.focus }))}
          cardWidth={small ? 230 : 340} cardHeight={small ? 300 : 440} radius={4}
          tint="#3a2f2a" depth={small ? 140 : 200} spread={small ? 34 : 120} tilt={16} tiltDirection="right"
          perspective={1500} visibleCards={4} falloff={0.09} blur={2} duration={750}
          showControls showIndicators={false} loop
          onChange={(i) => setActive(i)}
          onActiveClick={(i) => { location.href = items[i].href; }}
        />
      </div>
      <div className="lbd__cap" aria-live="polite">
        <span className="lbd__n">{String(active + 1).padStart(2, '0')}</span>
        <h2 key={it.id}>{it.name}</h2>
        <a className="lbd__open" href={it.href}>Open <span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}
