// Products shown with ReactBits displays (accordion gallery, orbit images, circular carousel). `modes` picks which are
// offered; with more than one, a switch at the side compares them and the choice is remembered in this browser.
import { useEffect, useState } from 'react';
import AccordionGallery from './reactbits/AccordionGallery.jsx';
import OrbitImages from './reactbits/OrbitImages.jsx';
import CircularCarousel from './reactbits/CircularCarousel.jsx';

const MODES = [
  ['accordion', 'Accordion'],
  ['orbit', 'Orbit'],
  ['carousel', 'Carousel'],
];
const KEY = 'emsworth-showcase';
// Crops sit near the top of each photo, so a model's face stays in frame.

export default function ProductShowcase({ items, modes = ['accordion', 'orbit', 'carousel'], storeKey = KEY }) {
  const offered = MODES.filter(([k]) => modes.includes(k));
  const [mode, setMode] = useState(offered[0][0]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    try { const m = localStorage.getItem(storeKey); if (offered.some(([k]) => k === m)) setMode(m); } catch { /* storage blocked */ }
    const mq = matchMedia('(max-width: 760px)');
    const on = () => setNarrow(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const pick = (m) => { setMode(m); setActive(0); try { localStorage.setItem(storeKey, m); } catch { /* storage blocked */ } };
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  const current = items[active] ?? items[0];

  return (
    <div className="showcase">
      {offered.length > 1 && <div className="showcase__switch" role="radiogroup" aria-label="How to show the products">
        <span>View</span>
        {offered.map(([k, label]) => (
          <button key={k} type="button" role="radio" aria-checked={mode === k} onClick={() => pick(k)}>{label}</button>
        ))}
      </div>}

      <div className={`showcase__stage${offered.length > 1 ? '' : ' showcase__stage--solo'}`}>
        {mode === 'accordion' && (
          <AccordionGallery
            items={items.map((it) => ({ image: it.image, label: it.name, link: it.href, alt: it.name }))}
            defaultIndex={1} height={narrow ? 520 : 560} gap={narrow ? 6 : 10} radius={4} expandRatio={narrow ? 0.5 : 0.42}
            accentColor={css('--accent') || '#c6a75e'} overlayColor={css('--dark') || '#141c30'} textColor="#ffffff"
            grayscale={false} tilt={6} parallax={0.5} trigger="hover"
          />
        )}

        {mode === 'orbit' && (
          // The centre stays quiet until a photo is hovered; then it names that product. Clicking a photo opens it.
          <div
            className="showcase__orbit"
            onPointerOver={(e) => {
              const item = e.target.closest?.('.orbit-item');
              const all = item ? [...e.currentTarget.querySelectorAll('.orbit-item')] : [];
              setHovered(item ? all.indexOf(item) : -1);
            }}
            onPointerLeave={() => setHovered(-1)}
          >
            <OrbitImages
              images={items.map((it) => it.thumb)} altPrefix="Emsworth product"
              shape="ellipse" baseWidth={1400} radiusX={narrow ? 520 : 600} radiusY={narrow ? 210 : 170} rotation={-6}
              duration={60} itemSize={narrow ? 210 : 170} itemRadius={4} depth={0.35} shadow={0}
              showPath pathColor="rgba(198,167,94,.45)" pathWidth={1.5} pathDash={4}
              hoverScale={1.06} hoverSpeed={0} clickToFront={false} onItemClick={(i) => { location.href = items[i].href; }}
              centerContent={
                hovered >= 0 ? (
                  <a className="showcase__center" href={items[hovered].href}>
                    <b>{items[hovered].name}</b>
                    <span>Open →</span>
                  </a>
                ) : null
              }
            />
          </div>
        )}

        {mode === 'carousel' && (
          <div className="showcase__carousel">
            <div className="showcase__ring">
            <CircularCarousel
              items={items.map((it) => ({ src: it.image, alt: it.name, title: it.name, subtitle: it.sub }))}
              preset="cylinder" intro="rise" cardWidth={narrow ? 200 : 260} aspectRatio={0.8} gap={22}
              autoplay="drift" speed={10} snap pauseOnHover focusOnClick captions
              fadeColor={css('--ground') || '#f6efe4'} depthFade={0.5} innerShade={0.35} cornerRadius={4}
              onChange={(i) => setActive(typeof i === 'number' ? i : 0)}
              onItemClick={(_, i) => { if (i === active) location.href = items[i].href; else setActive(i); }}
            />
            </div>
            <a className="showcase__go" href={current.href}>See {current.name} →</a>
          </div>
        )}
      </div>
    </div>
  );
}
