// Cards that pin and stack as the page scrolls (ReactBits ScrollStack), with ordinary native scrolling.
// Each card: words on the left, the photo whole on the right (its column is the photo's own shape, so nothing is cropped).
import ScrollStack, { ScrollStackItem } from './reactbits/ScrollStack.jsx';

export default function StackCards({ items, gap = 14 }) {
  return (
    <ScrollStack className="stk" useWindowScroll smoothScroll={false} snap={false}
      stackPosition="16%" itemStackDistance={gap} itemDistance={80} itemScale={0.03} baseScale={0.9} dimAmount={0.12} holdDistance={120}>
      {items.map((it, i) => (
        <ScrollStackItem key={it.href} itemClassName="stk__card">
          <a className="stk__link" href={it.href} style={{ '--ar': it.ar }}>
            <span className="stk__txt">
              <span className="stk__n">{String(i + 1).padStart(2, '0')}</span>
              {it.kicker && <span className="label">{it.kicker}</span>}
              <b className="stk__h">{it.title}</b>
              {it.text && <span className="stk__p">{it.text}</span>}
              {it.meta && <span className="stk__meta">{it.meta}</span>}
              <span className="link">{it.cta}</span>
            </span>
            <span className="stk__img">
              <img src={it.src} srcSet={it.srcset} sizes="(max-width: 760px) 92vw, 50vw" alt={it.alt ?? ''} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
            </span>
          </a>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
