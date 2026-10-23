export const EMAIL = 'info@emsworthhospitality.com';

export const NAV = [
  { href: '/hospitality/', label: 'Hospitality' },
  { href: '/collection/', label: 'Designer Collection' },
  { href: '/tailor-made/', label: 'Tailor-Made' },
  { href: '/about/', label: 'About' },
];

export type Colourway = {
  key: string;
  name: string;
  hex: string;
  fold: string;
  set?: string;
  detail?: string;
  face?: string;
  slipper?: string;
};

export type Pattern = {
  slug: string;
  name: string;
  kicker: string;
  intro: string;
  notes: string[];
  colourways: Colourway[];
};

const cw = (pattern: string, key: string, name: string, hex: string, has: { set?: boolean; detail?: boolean; face?: boolean; slipper?: boolean }): Colourway => ({
  key,
  name,
  hex,
  fold: `collection/${pattern}-${key}-fold`,
  set: has.set ? `collection/${pattern}-${key}-set` : undefined,
  detail: has.detail ? `collection/${pattern}-${key}-detail` : undefined,
  face: has.face ? `collection/${pattern}-${key}-face` : undefined,
  slipper: has.slipper ? `collection/${pattern}-${key}-slipper` : undefined,
});

const HEX = { navy: '#1F3F8C', terracotta: '#B4552E', sage: '#8DB07A', onyx: '#1C1C1C' };

export const PATTERNS: Pattern[] = [
  {
    slug: 'swirl',
    name: 'Swirl',
    kicker: 'Jacquard terry',
    intro: 'Fluid, hand-drawn loops woven straight into the terry. A statement for pool decks, beach clubs and boutique bathrooms.',
    notes: ['Two-colour jacquard woven into the pile', 'Contrast dobby border', 'Shown as bath towel, hand towel and face towel'],
    colourways: [
      cw('swirl', 'navy', 'Navy', HEX.navy, { set: true, detail: true }),
      cw('swirl', 'terracotta', 'Terracotta', HEX.terracotta, { set: true, detail: true }),
      cw('swirl', 'sage', 'Sage', HEX.sage, { set: true, detail: true }),
      cw('swirl', 'onyx', 'Onyx', HEX.onyx, { set: true, detail: true, face: true }),
    ],
  },
  {
    slug: 'stripe',
    name: 'Stripe',
    kicker: 'Jacquard terry',
    intro: 'A fine woven stripe with a hand-drawn edge — calm enough for guest rooms, graphic enough for the pool.',
    notes: ['Two-colour jacquard woven into the pile', 'Contrast dobby border', 'Shown as bath towel, hand towel and face towel'],
    colourways: [
      cw('stripe', 'navy', 'Navy', HEX.navy, { set: true, detail: true, face: true }),
      cw('stripe', 'terracotta', 'Terracotta', HEX.terracotta, { set: true, detail: true }),
      cw('stripe', 'sage', 'Sage', HEX.sage, { set: true, detail: true, face: true }),
      cw('stripe', 'onyx', 'Onyx', HEX.onyx, { set: true, detail: true, face: true }),
    ],
  },
  {
    slug: 'check',
    name: 'Check',
    kicker: 'Jacquard terry',
    intro: 'A bold block check that reads from across the pool. Easy to spot, easy to count, hard to mistake for room linen.',
    notes: ['Two-colour jacquard woven into the pile', 'Contrast dobby border', 'Shown as bath towel, hand towel and face towel'],
    colourways: [
      cw('check', 'navy', 'Navy', HEX.navy, { set: true, detail: true }),
      cw('check', 'terracotta', 'Terracotta', HEX.terracotta, { set: true, detail: true }),
      cw('check', 'sage', 'Sage', HEX.sage, { set: true, detail: true, face: true }),
      cw('check', 'onyx', 'Onyx', HEX.onyx, { set: true, detail: true, face: true }),
    ],
  },
  {
    slug: 'harlequin',
    name: 'Harlequin',
    kicker: 'Jacquard terry',
    intro: 'A tight diamond zigzag with movement in every fold. Our most graphic weave.',
    notes: ['Two-colour jacquard woven into the pile', 'Contrast dobby border', 'Shown as bath towel, hand towel and face towel'],
    colourways: [
      cw('harlequin', 'navy', 'Navy', HEX.navy, { set: true, detail: true, face: true }),
      cw('harlequin', 'terracotta', 'Terracotta', HEX.terracotta, { detail: true }),
      cw('harlequin', 'sage', 'Sage', HEX.sage, { set: true, detail: true }),
      cw('harlequin', 'onyx', 'Onyx', HEX.onyx, { set: true, detail: true, face: true }),
    ],
  },
  {
    slug: 'animal',
    name: 'Animal',
    kicker: 'Jacquard terry & slippers',
    intro: 'Leopard, snow leopard and zebra — woven, not printed, with matching guest slippers.',
    notes: ['Jacquard woven into the pile', 'Black border', 'Matching slippers available'],
    colourways: [
      cw('animal', 'leopard', 'Leopard', '#B97A3C', { set: true, detail: true, slipper: true }),
      cw('animal', 'snow-leopard', 'Snow Leopard', '#D9D9D6', { set: true, detail: true, slipper: true }),
      cw('animal', 'zebra', 'Zebra', '#2A2A2A', { set: true, detail: true, slipper: true }),
    ],
  },
  {
    slug: 'plain',
    name: 'Plain',
    kicker: 'Dyed terry',
    intro: 'Ten quiet colours in soft terry with a tonal border — the base layer for any room, spa or changing area.',
    notes: ['Piece-dyed terry', 'Tonal woven border', 'Dyed to Pantone reference on request'],
    colourways: [
      cw('plain', 'white', 'White', '#F7F7F4', { detail: true }),
      cw('plain', 'ivory', 'Ivory', '#F1E6D2', { detail: true }),
      cw('plain', 'natural', 'Natural', '#EFE7D6', { detail: true }),
      cw('plain', 'sand', 'Sand', '#D6A57C', { detail: true }),
      cw('plain', 'blush', 'Blush', '#EBC3B8', { detail: true }),
      cw('plain', 'terracotta', 'Terracotta', '#C6582D', { detail: true }),
      cw('plain', 'olive', 'Olive', '#7E8B3D', { detail: true }),
      cw('plain', 'slate', 'Slate', '#8D99A1', { detail: true }),
      cw('plain', 'charcoal', 'Charcoal', '#4A4A50', { detail: true }),
      cw('plain', 'navy', 'Navy', '#1E2A4F', { detail: true }),
    ],
  },
];

export type Category = {
  slug: string;
  name: string;
  short: string;
  kicker: string;
  hero: string;
  card?: string;
  intro: string;
  highlights: { title: string; text: string }[];
  specs?: { label: string; value: string }[];
  gallery: { src: string; alt: string }[];
  tiers?: boolean;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'bath-linen',
    name: 'Bath Linen',
    short: 'Bath sheets, towels and mats from 400 to 750 GSM.',
    kicker: 'Hospitality',
    hero: 'lifestyle/shoot-14',
    card: 'lifestyle/shoot-14',
    intro: 'Terry is what we know best. Every collection carries the same item ladder — bath sheet, bath towel, hand towel, face towel and bath mat — so specifications compare like-for-like across budgets.',
    highlights: [
      { title: 'Constructions', text: 'Zero-twist, double loop, single loop, waffle and jacquard terry.' },
      { title: 'Borders', text: 'Dobby, satin band, cam or a custom jacquard border to your artwork.' },
      { title: 'Branding', text: 'Woven jacquard logos or embroidery, placed where guests look.' },
      { title: 'Antimicrobial finish', text: 'Optional odour-control finish, verified by Intertek.' },
    ],
    specs: [
      { label: 'Bath sheet', value: '90 × 180 cm' },
      { label: 'Bath towel', value: '70 × 140 · 75 × 150 cm' },
      { label: 'Hand towel', value: '40 × 70 · 50 × 90 cm' },
      { label: 'Face towel', value: '30 × 30 cm' },
      { label: 'Bath mat', value: '50 × 80 cm' },
      { label: 'Colour', value: 'Optical white or dyed to Pantone' },
    ],
    gallery: [
      { src: 'hospitality/terry-03', alt: 'Embroidered Emsworth logo on white terry' },
      { src: 'hospitality/terry-13', alt: 'Embossed shell jacquard on a white towel' },
      { src: 'hospitality/terry-15', alt: 'Geometric jacquard white towel' },
      { src: 'hospitality/terry-05', alt: 'Dobby border detail on white terry' },
      { src: 'lifestyle/shoot-05', alt: 'Woven white bath mat' },
      { src: 'hospitality/terry-35', alt: 'White waffle weave' },
      { src: 'hospitality/terry-09', alt: 'Folded white terry with woven border' },
      { src: 'hospitality/terry-37', alt: 'Blush terry close-up' },
      { src: 'lifestyle/shoot-09', alt: 'Guest with an ivory bath towel' },
    ],
    tiers: true,
  },
  {
    slug: 'bed-linen',
    name: 'Bed Linen',
    short: 'Percale, sateen, jacquard and satin stripe, 200 to 400 threads.',
    kicker: 'Hospitality',
    hero: 'hospitality/bed-46',
    card: 'hospitality/bed-room',
    intro: 'Crisp percale for high-turnover rooms, sateen where the bed is the product, and satin stripe that survives industrial laundering indefinitely. Built to your mattress dimensions at no premium.',
    highlights: [
      { title: 'Percale', text: '200 TC in pure cotton or 50/50 polycotton for on-premise laundries.' },
      { title: 'Sateen', text: '250, 300 and 400 TC combed cotton — from four-star default to suites.' },
      { title: 'Jacquard & satin stripe', text: 'Woven patterns and 1 cm or 3 cm satin bands that never wash out.' },
      { title: 'Top of bed', text: 'Duvets, pillows, blankets, protectors, encasements, toppers and runners.' },
    ],
    specs: [
      { label: 'Flat sheet', value: '1 cm hem each side' },
      { label: 'Fitted sheet', value: '32 cm pocket, elastic all round' },
      { label: 'Duvet cover', value: 'Bottom opening, inner overlap' },
      { label: 'Pillow case', value: 'Housewife or Oxford, 15 cm overlap' },
      { label: 'Duvets', value: 'Microfibre 200 / 300 / 400 GSM, goose down' },
      { label: 'Sizes', value: 'Single to Super King — quote the mattress size' },
    ],
    gallery: [
      { src: 'hospitality/bed-41', alt: 'Satin stripe pillowcase' },
      { src: 'hospitality/bed-42', alt: 'Damask jacquard pillowcase' },
      { src: 'hospitality/bed-43', alt: 'Tone-on-tone jacquard pillowcase' },
      { src: 'hospitality/bed-44', alt: 'Plain white sateen pillowcase' },
      { src: 'hospitality/bed-48', alt: 'Pillowcase hem detail' },
    ],
  },
  {
    slug: 'robes-slippers',
    name: 'Robes & Slippers',
    short: 'Terry, waffle, velour and coral velvet robes, with matching slippers.',
    kicker: 'Guest comfort',
    hero: 'lifestyle/shoot-18',
    intro: 'Seven robe constructions across shawl and kimono collars. Terry for cool rooms and a plush hand; waffle for the Gulf, where a heavy robe goes unworn. Slippers to match, from 4 mm EVA for carpet to 5 mm for marble.',
    highlights: [
      { title: 'Terry robes', text: '400 GSM cotton terry, shawl or kimono collar.' },
      { title: 'Waffle robes', text: 'Small or big weave, 250–280 GSM — dries in roughly half the time.' },
      { title: 'Velour & coral velvet', text: 'Spa weight with a terry reverse that still absorbs.' },
      { title: 'Slippers', text: 'Waffle, terry, velour, coral velvet, linen and paper-grass with eco soles.' },
    ],
    specs: [
      { label: 'Robe sizes', value: 'S · M · L · XL · XXL · Kids' },
      { label: 'Make-up', value: 'Self belt, two patch pockets, hanging loop' },
      { label: 'Branding', value: 'Embroidered crest, up to six thread colours' },
      { label: 'Slipper soles', value: '4 mm EVA (carpet) · 5 mm (marble / tile)' },
      { label: 'Eco options', value: 'Coir and paper-grass biodegradable soles' },
    ],
    gallery: [
      { src: 'hospitality/guest-06', alt: 'White waffle robe with matching slippers' },
      { src: 'hospitality/guest-07', alt: 'Folded robe and slippers' },
      { src: 'hospitality/guest-04', alt: 'White terry slippers with Emsworth tag' },
      { src: 'lifestyle/shoot-16', alt: 'Guest in an Emsworth bathrobe' },
      { src: 'collection/animal-leopard-slipper', alt: 'Leopard jacquard slippers' },
      { src: 'lifestyle/shoot-17', alt: 'Guest relaxing in a white robe' },
      { src: 'hospitality/guest-05', alt: 'Folded white towel set' },
    ],
  },
  {
    slug: 'pool-beach',
    name: 'Pool & Beach',
    short: 'Yarn-dyed cabana stripes and lounger towels built for sun and chlorine.',
    kicker: 'Leisure',
    hero: 'lifestyle/shoot-20',
    intro: 'Pool linen is handled wet, counted at a desk and taken home by mistake. Yarn-dyed stripes hold their colour through chlorine and sun, and make a towel recognisable as pool stock from fifty metres.',
    highlights: [
      { title: 'Cabana stripe', text: 'Colour goes in at the yarn stage, so the stripe outlasts the laundry.' },
      { title: 'Jacquard pool towels', text: 'Swirl, check and harlequin weaves from the Designer Collection.' },
      { title: 'Gym towels', text: 'Long, narrow sizes with a centre stripe for identification.' },
      { title: 'Logo print', text: 'Screen or heat-transfer logos for clubs and leisure brands.' },
    ],
    specs: [
      { label: 'Pool towel', value: '80 × 160 · 90 × 180 cm' },
      { label: 'Gym towel', value: '30 × 110 · 50 × 100 cm' },
      { label: 'Weight', value: '500–550 GSM' },
      { label: 'Colours', value: 'Matched to Pantone reference' },
    ],
    gallery: [
      { src: 'field/cabana', alt: 'Jacquard pool towel on a cabana daybed in Dubai' },
      { src: 'hospitality/pool-26', alt: 'Yellow cabana stripe close-up' },
      { src: 'lifestyle/shoot-21', alt: 'Striped pool towels on a lounger' },
      { src: 'hospitality/pool-28', alt: 'Grey cabana stripe close-up' },
      { src: 'field/beach-loungers', alt: 'Beach club loungers dressed with rolled towels' },
      { src: 'lifestyle/shoot-22', alt: 'Guest with a sage pool towel' },
    ],
  },
  {
    slug: 'table-fb',
    name: 'Table & F&B',
    short: 'Banqueting cloths, napkins and colour-coded kitchen linen.',
    kicker: 'Food & beverage',
    hero: 'hospitality/table-13',
    intro: 'Cotton satin-band table linen with mitred corners, and the kitchen linen that never reaches a guest but decides whether a service runs. Round cloths are cut to drop, not to diameter.',
    highlights: [
      { title: 'Banqueting', text: '240 GSM cotton, mitred corners and a 1 cm hem as standard.' },
      { title: 'Napkins & runners', text: 'Napkins in 45, 50 and 55 cm, runners, placemats and skirting.' },
      { title: 'Kitchen', text: 'Herringbone kitchen towels, glass cloths, bar mops and chef cloths.' },
      { title: 'Colour coding', text: 'Centre stripes in blue, green, red and yellow keep kitchen and bar apart.' },
    ],
    specs: [
      { label: 'Napkins', value: '45 × 45 · 50 × 50 · 55 × 55 cm' },
      { label: 'Square cloths', value: '137 to 230 cm' },
      { label: 'Round cloths', value: '180 to 335 cm, cut to your drop' },
      { label: 'Colour', value: 'Ivory and white standard, or Pantone' },
    ],
    gallery: [
      { src: 'hospitality/table-01', alt: 'Saffron napkin with satin band' },
      { src: 'hospitality/table-07', alt: 'White napkin with embroidered motif' },
      { src: 'hospitality/table-15', alt: 'Rose jacquard napkin' },
      { src: 'hospitality/table-04', alt: 'Printed linear napkin' },
      { src: 'hospitality/table-19', alt: 'Burgundy napkin' },
      { src: 'hospitality/table-21', alt: 'White napkin with blue stripe' },
      { src: 'hospitality/table-22', alt: 'Glass cloth with black woven stripe' },
      { src: 'hospitality/table-24', alt: 'Glass cloth with red woven stripe' },
      { src: 'hospitality/table-25', alt: 'Glass cloth with teal woven stripe' },
      { src: 'hospitality/table-10', alt: 'Red heart jacquard kitchen towel' },
    ],
  },
  {
    slug: 'uniforms',
    name: 'Uniforms',
    short: 'Shirts and uniform garments from the group’s own garment unit.',
    kicker: 'Garments',
    hero: 'hospitality/uniform-54',
    intro: 'The Christy group runs a dedicated garment unit alongside its weaving and finishing lines. Staff shirts are made, finished and individually boxed for distribution to your team.',
    highlights: [
      { title: 'Made in-house', text: 'Cut, sewn and finished within the group’s own garment unit.' },
      { title: 'Presentation', text: 'Individually folded and packed in a kraft gift box.' },
      { title: 'Branding', text: 'Embroidered logos and woven labels to your specification.' },
      { title: 'Programmes', text: 'Sized and packed per department for easy roll-out.' },
    ],
    gallery: [
      { src: 'hospitality/uniform-52', alt: 'Folded white shirt' },
      { src: 'hospitality/uniform-55', alt: 'White shirt collar detail' },
      { src: 'hospitality/uniform-56', alt: 'Shirt in kraft presentation box' },
      { src: 'hospitality/uniform-57', alt: 'Boxed shirt, angled' },
    ],
  },
];

export const TIERS = [
  { name: 'Signature', tag: 'Flagship', gsm: '600+ GSM', v: 0.95, comp: '100% Combed Cotton', yarn: '2/20s Ring Spun', cons: '3-Pile Terry', for: 'Suites, presidential floors and spa.', img: 'collection/plain-white-detail' },
  { name: 'Zero-Twist', tag: 'New', gsm: '400–600 GSM', v: 0.78, comp: '100% Cotton', yarn: '10s · 14s · 16s', cons: 'Zero-Twist Terry', for: 'Untwisted loops that drink, not push, water.', img: 'collection/plain-ivory-detail' },
  { name: 'Classic', tag: 'Workhorse', gsm: '500+ GSM', v: 0.72, comp: '100% Carded Cotton', yarn: '16s Ring Spun', cons: 'Single Loop Terry', for: 'High-turnover four-star rooms. Chlorine tolerant.', img: 'hospitality/terry-19' },
  { name: 'Essential', gsm: '400+ GSM', v: 0.55, comp: '100% Cotton', yarn: '10s Open End', cons: 'Single Cam Terry', for: 'Economy, staff and back-of-house. Honest weight.', img: 'collection/plain-natural-detail' },
  { name: 'Organic', tag: 'GOTS', gsm: '550 GSM', v: 0.74, comp: '100% GOTS Organic Cotton', yarn: '16s Combed Ring Spun', cons: 'Double Loop Terry', for: 'Eco-positioned properties and EU/UK tenders.', img: 'collection/plain-olive-detail' },
  { name: 'Bamboo-Cotton', gsm: '500–650 GSM', v: 0.8, comp: 'Bamboo · Cotton blend', yarn: 'Fluid drape, soft sheen', cons: 'Terry', for: 'Spa, wellness and premium suites.', img: 'collection/plain-slate-detail' },
  { name: 'Cabana Pool', tag: 'Yarn-dyed', gsm: '550 GSM', v: 0.74, comp: '100% Cotton', yarn: '16s Ring Spun', cons: 'Yarn-Dyed Terry', for: 'Pool, beach club and gym. Stripe survives chlorine.', img: 'collection/check-navy-detail' },
  { name: 'Spa Colour', gsm: '550 GSM', v: 0.74, comp: '100% Cotton', yarn: '16s Ring Spun', cons: 'Piece-Dyed Terry', for: 'Treatment rooms, where white reads clinical.', img: 'collection/plain-sand-detail' },
];
