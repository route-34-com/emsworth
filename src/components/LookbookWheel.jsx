// Lookbook landing: the product names on a ReactBits Option Wheel, and the product photographs in a ReactBits Depth
// Carousel beside it. The two move together: turn the wheel and the carousel follows; swipe or click the carousel and the
// wheel follows. Clicking the chosen name or the photo in front opens that product.
import { useEffect, useState } from 'react';
import OptionWheel from './reactbits/OptionWheel.jsx';
import DepthCarousel from './reactbits/DepthCarousel.jsx';

export default function LookbookWheel({ items, start = 1 }) {
  const [active, setActive] = useState(start);
  const [w, setW] = useState(() => window.innerWidth);
  const [box, setBox] = useState({ w: 600, h: 600 });
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  const small = w < 760;
  const open = (i) => { location.href = items[i].href; };
  // Cards as tall as the space allows, in a 4:5 print shape.
  const measure = (el) => { if (el) { const r = el.getBoundingClientRect(); if (Math.abs(r.height - box.h) > 4 || Math.abs(r.width - box.w) > 4) setBox({ w: r.width, h: r.height }); } };
  const ch = Math.min(box.h * 0.92, (box.w - 120) * 1.25);
  return (
    <div className="lbw">
      <div className="lbw__wheel">
        <OptionWheel
          items={items.map((p) => p.name)} defaultSelected={start} value={active} onChange={(i) => setActive(i)} onSelectedClick={open}
          textColor="#9a958c" activeColor="#1f2a44" side="left" fontSize={small ? 1.9 : 2.8} spacing={1.35}
          tilt={10} curve={1} blur={1.2} fade={0.22} minOpacity={0.12} smoothing={220} soundUrl="/sounds/pop.wav" soundVolume={0.35} inset={small ? 30 : 50}
        />
        <a className="lbw__open" href={items[active].href}>Open {items[active].name} <span aria-hidden="true">→</span></a>
      </div>
      <div className="lbw__depth" ref={measure}>
        <DepthCarousel
          items={items.map((p) => ({ image: p.image, alt: p.name, focus: p.focus }))}
          index={active} onChange={(i) => setActive(i)} onActiveClick={open}
          cardWidth={Math.round(ch * 0.8)} cardHeight={Math.round(ch)} radius={4} tint="#3a2f2a"
          depth={small ? 120 : 170} spread={small ? 30 : 55} tilt={14} tiltDirection="right" perspective={1500}
          visibleCards={3} falloff={0.1} blur={2} duration={750} showControls={false} showIndicators={false} loop
        />
        <span className="lbw__name" key={`n${active}`}>{String(active + 1).padStart(2, '0')} · {items[active].name}</span>
      </div>
    </div>
  );
}
