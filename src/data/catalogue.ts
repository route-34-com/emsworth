// Product content from the Emsworth Hospitality Product Catalogue 2026 and the
// Christy Textile company profile. GSM ±5%, dimensions ±3%.
import { pick, inFolder as photosIn, closeups } from './shoot';

const inFolder = (folder: string) => photosIn(folder).map((p) => p.src);

export type Spec = [string, string];
export type Program = { id: string; name: string; line: string; specs: Spec[] };
export type Collection = {
  slug: string; name: string; kicker: string; intro: string; image: ImageMetadata; alt: string;
  programs: Program[]; gallery: ImageMetadata[];
};

const terrySizes = 'Face 30×30 · Hand 40×70, 50×90 · Bath 70×140, 75×150 · Sheet 90×180 · Mat 50×80 cm';
const terry = (o: { construction: string; gsm: string; composition: string; yarn: string; washes: string; moq: string }): Spec[] => [
  ['Construction', o.construction], ['Weight', o.gsm], ['Composition', o.composition], ['Yarn', o.yarn],
  ['Sizes', terrySizes], ['Shrinkage', 'Max 8% length, 5% width after five washes'],
  ['Wash life', `${o.washes} commercial cycles, per laundry guidance`], ['MOQ', o.moq], ['Lead time', '45–60 days from approval'],
];
const sheet = (o: { tc: string; composition: string; yarn: string; weave: string }): Spec[] => [
  ['Weave', o.weave], ['Thread count', o.tc], ['Composition', o.composition], ['Yarn', o.yarn],
  ['Items', 'Flat & fitted sheets, duvet covers, pillowcases, Single to Super King'],
  ['Shrinkage', 'Max 5% after five washes'], ['MOQ / lead', '500 pcs · 50–70 days'],
];

export const tiers = [
  { id: 'signature', name: 'Signature', gsm: 700, construction: 'Zero-twist terry', for: 'Suites, presidential floors, spa' },
  { id: 'select', name: 'Select', gsm: 600, construction: 'Double loop terry', for: 'Four and five star guest rooms' },
  { id: 'classic', name: 'Classic', gsm: 500, construction: 'Single loop terry', for: 'High-turnover, four star' },
  { id: 'essential', name: 'Essential', gsm: 420, construction: 'Single cam terry', for: 'Staff, back of house, pool decks' },
];

export const collections: Collection[] = [
  {
    slug: 'bath', name: 'Bath Linen', kicker: 'The first touch of the day',
    intro: 'Four tiers from 420 to 700 GSM on the same item ladder, so a specification compares like for like: Signature in suites, Select in guest rooms, Essential back of house. Plus GOTS organic and bamboo-cotton.',
    image: pick('slipper-robe', 'j8a2535-edit'), alt: 'Folded white Emsworth bath towels',
    gallery: [...closeups.bath, ...inFolder('outdoor/floor-mat')],
    programs: [
      { id: 'signature', name: 'Signature', line: 'Zero-twist combed cotton at 700 GSM. The loop is left untwisted, so it drinks rather than pushing water around.',
        specs: terry({ construction: 'Zero-twist terry', gsm: '700 GSM', composition: '100% combed cotton', yarn: '16s/2 ring spun', washes: '300', moq: '500 pcs per size per colour' }) },
      { id: 'select', name: 'Select', line: 'The working specification for four and five star guest rooms. Dense in the hand, light enough to turn in a single dry cycle.',
        specs: terry({ construction: 'Double loop terry', gsm: '600 GSM', composition: '100% combed cotton', yarn: '16s ring spun', washes: '300', moq: '500 pcs per size per colour' }) },
      { id: 'classic', name: 'Classic', line: 'Built for high-turnover properties where a towel sees the laundry every day. Chlorine tolerant to 200 ppm.',
        specs: terry({ construction: 'Single loop terry', gsm: '500 GSM', composition: '100% cotton', yarn: '16s ring spun', washes: '250', moq: '1,000 pcs per size per colour' }) },
      { id: 'essential', name: 'Essential', line: 'Staff accommodation, back of house and tight linen budgets. Honest construction at an honest weight.',
        specs: terry({ construction: 'Single cam terry', gsm: '420 GSM', composition: '100% cotton', yarn: '10s open end', washes: '250', moq: '2,000 pcs per size per colour' }) },
      { id: 'organic', name: 'Organic', line: 'GOTS certified with full chain of custody, fibre to finished piece, so your sustainability report can cite it.',
        specs: terry({ construction: 'Double loop terry', gsm: '550 GSM', composition: '100% GOTS organic cotton', yarn: '16s combed ring spun', washes: '250', moq: '1,000 pcs per size per colour' }) },
      { id: 'bamboo-cotton', name: 'Bamboo-Cotton', line: 'A fluid drape and soft sheen that sets it apart on the same rail. Spa, wellness and premium suites.',
        specs: terry({ construction: 'Zero-twist terry', gsm: '600 GSM', composition: '70% bamboo viscose, 30% cotton', yarn: '21s ring spun', washes: '200', moq: '1,000 pcs per size per colour' }) },
    ],
  },
  {
    slug: 'bed', name: 'Bed Linen', kicker: 'Lights out. The sheets do the rest.',
    intro: 'Percale, sateen, jacquard and satin stripe from 200 to 400 threads, sized to your mattress at no premium.',
    image: pick('hospitality-closeup', 'j8a2522'), alt: 'White pillowcase with a double row of hemstitching',
    gallery: closeups.bed,
    programs: [
      { id: 'satin-stripe', name: 'Satin Stripe', line: 'Woven, not printed, so its tone-on-tone lustre survives industrial laundering indefinitely.',
        specs: [['Weave', 'Tone-on-tone satin stripe'], ['Thread count', '250 or 300 TC'], ['Stripe', '1 cm at 250 TC · 3 cm at 300 TC'],
          ['Composition', '100% combed cotton, or 50/50 polycotton'], ['Items', 'Flat & fitted sheets, duvet covers, pillowcases'], ['MOQ / lead', '500 pcs · 50–70 days']] },
      { id: 'sateen-400', name: '400 TC Sateen', line: 'The top of the woven range. Dense, fluid, closer to fine domestic linen than a contract sheet.',
        specs: sheet({ tc: '400 TC · 135 GSM', composition: '100% combed cotton', yarn: '60s × 80s', weave: 'Combed sateen' }) },
      { id: 'sateen-300', name: '300 TC Sateen', line: 'Finer in the hand than 250, with a closer surface and deeper lustre. For rooms where the bed is the product.',
        specs: sheet({ tc: '300 TC · 125 GSM', composition: '100% combed cotton', yarn: '60s × 40s', weave: 'Combed sateen' }) },
      { id: 'sateen-250', name: '250 TC Sateen', line: 'Where a sheet starts to feel like a choice. The four-star default across the Gulf.',
        specs: sheet({ tc: '250 TC · 120 GSM', composition: '100% combed cotton', yarn: '40s × 40s', weave: 'Combed sateen' }) },
      { id: 'percale-200', name: '200 TC Percale', line: 'Crisp, cool plain weave. Calenders beautifully and forgives a laundry that runs hot.',
        specs: sheet({ tc: '200 TC · 115 GSM', composition: '100% cotton, or 50/50 polycotton for on-premise laundries', yarn: '40s × 40s', weave: 'Plain weave percale' }) },
      { id: 'jacquard-300', name: '300 TC Jacquard', line: 'Pattern woven into the structure, so it cannot fade. Stock designs, or your own artwork from 1,000 pcs.',
        specs: sheet({ tc: '300 TC · 125 GSM', composition: '100% combed cotton', yarn: '60s × 40s', weave: 'Jacquard dobby' }) },
    ],
  },
  {
    slug: 'table', name: 'Table & F&B', kicker: 'Breakfast, set properly',
    intro: 'Table linen that folds crisp and comes back from the laundry the same white it left, and the kitchen linen that decides whether a service runs.',
    image: pick('napkin', 'j8a2567'), alt: 'White napkin with an embroidered crest on a dinner plate',
    gallery: inFolder('napkin'),
    programs: [
      { id: 'satin-band', name: 'Satin Band Table Linen', line: 'Cotton table linen with a woven satin band, mitred corners and a 1 cm hem. Spun polyester in every size for banqueting.',
        specs: [['Weight', '240 GSM'], ['Composition', '100% cotton, or spun polyester'], ['Napkins', '45×45 · 50×50 · 55×55 cm'],
          ['Cloths', '137 to 335 cm square, oblong and round'], ['Make-up', 'Mitred corner, 1 cm hem'], ['Rounds', 'Cut to your table diameter and drop']] },
      { id: 'kitchen-bar', name: 'Kitchen & Bar', line: 'Herringbone kitchen towels, glass cloths and bar mops with a coloured centre stripe, so kitchen cloths stay out of the bar.',
        specs: [['Composition', '100% cotton, linen union glass cloths'], ['Weight', '200–400 GSM'],
          ['Items', 'Kitchen towel 40×65 · Glass cloth 50×70 · Bar mop 40×48 · Chef cloth 45×90 cm'], ['Colour code', 'Blue, green, red, yellow centre stripe'], ['Make-up', 'Overlocked or hemmed']] },
    ],
  },
  {
    slug: 'pool-spa', name: 'Pool & Spa', kicker: 'Comfort beyond the room',
    intro: 'Pool linen is handled wet, counted at a desk, and taken home. Cabana is built for that. Spa Colour is for treatment rooms, where white reads clinical rather than calm.',
    image: pick('hospitality-closeup', 'j8a2475'), alt: 'Grey and white yarn-dyed Cabana pool towel',
    gallery: [...closeups.pool, ...inFolder('outdoor/s3')],
    programs: [
      { id: 'cabana', name: 'Cabana', line: 'Yarn dyed, so the stripe survives chlorine and sun. A wide stripe marks it as pool stock at fifty metres, the cheapest theft control there is.',
        specs: [['Construction', 'Yarn-dyed terry'], ['Weight', '550 GSM'], ['Composition', '100% cotton, 16s ring spun'],
          ['Sizes', 'Pool 80×160, 90×180 · Gym 30×110, 50×100 cm'], ['Colours', 'Blue, green, grey, khaki, or matched to Pantone'], ['MOQ', '1,000 pcs per colour per size']] },
      { id: 'spa-colour', name: 'Spa Colour', line: 'Piece-dyed terry in muted neutrals for spas, salons and treatment rooms.',
        specs: [['Construction', 'Piece-dyed terry'], ['Weight', '550 GSM'], ['Composition', '100% cotton, 16s ring spun'],
          ['Sizes', 'Face 30×30 · Hand 40×70 · Bath 70×140 · Mat 50×80 cm'], ['Colours', 'Beige, grey, charcoal, sand'], ['MOQ', '1,000 pcs per colour per size']] },
    ],
  },
  {
    slug: 'robes-slippers', name: 'Robes & Slippers', kicker: 'A quiet moment of indulgence',
    intro: 'Seven robe constructions across shawl and kimono collars, and seven slippers. The choice is mostly about climate and laundry.',
    image: pick('slipper-robe', 'j8a2542'), alt: 'White waffle robe with matching Emsworth slippers',
    gallery: [...inFolder('slipper-robe'), ...closeups.robe, ...inFolder('outdoor/s2')],
    programs: [
      { id: 'waffle-robe', name: 'Waffle Robe', line: 'A third lighter than terry and dries in roughly half the time. The Gulf guest-room specification.',
        specs: [['Composition', '100% cotton waffle'], ['Weight', '250–280 GSM, small or big weave'], ['Collar', 'Kimono'],
          ['Sizes', 'S to XXL, and kids 8–12 yrs'], ['Branding', 'Embroidered logo, up to 6 colours, from 300 pcs'], ['MOQ / lead', '300 pcs per style per size · 45–60 days']] },
      { id: 'terry-robe', name: 'Terry Robe', line: 'Plush weight and the visual signal of luxury, for suites. Velour-faced where the robe needs to photograph well.',
        specs: [['Composition', '100% cotton terry'], ['Weight', '400–420 GSM'], ['Velour', 'Velour face, terry back, for suites'], ['Collar', 'Shawl or kimono'],
          ['Sizes', 'S to XXL, and kids 8–12 yrs'], ['MOQ / lead', '300 pcs per style per size · 45–60 days']] },
      { id: 'slippers', name: 'Slippers', line: 'Sole thickness matters most: 4 mm EVA is fine on carpet, 5 mm is what marble and tile need.',
        specs: [['Sole', '4 or 5 mm EVA'], ['Uppers', 'Terry, waffle, velour'], ['Eco styles', 'Linen and paper grass, biodegradable coir sole'],
          ['Styles', 'Open and closed toe'], ['Sizes', 'Adult 29 cm · Kids 24 cm'], ['MOQ', '1,000 pcs']] },
    ],
  },
];

export const bySlug = (s: string) => collections.find((c) => c.slug === s)!;

/** The six photographed ranges (the shoot's SKU folders). */
export type Range = {
  slug: string; name: string; tag: string; line: string; body: string; colours: string; for: string;
  lead: ImageMetadata; folder: string; specFrom?: { collection: string; program: string };
};
export const ranges: Range[] = [
  { slug: 'bath-signature', name: 'Bath Signature', tag: 'Hotel white', folder: 'ranges/bath-signature',
    line: 'The white zero-twist towel every suite is judged by.',
    body: 'Our Signature construction in optical white: zero-twist combed cotton that stays open and thirsty wash after wash, finished with a woven dobby border.',
    colours: 'Optical white', for: 'Suites, presidential floors, spa', lead: pick('ranges/bath-signature', 'j8a0665-edit'),
    specFrom: { collection: 'bath', program: 'signature' } },
  { slug: 'bath-robe', name: 'Bath Robe', tag: 'Shawl & kimono', folder: 'ranges/bath-robe',
    line: 'Robes that look as good in a guest’s photo as they feel at turndown.',
    body: 'Waffle and terry robes in shawl and kimono collars, photographed in white, navy, grey and blush. Every colour can be dyed to your Pantone and embroidered with your crest.',
    colours: 'White · Navy · Grey · Blush', for: 'Guest rooms, suites, spa', lead: pick('ranges/bath-robe', 'j8a0697-edit'),
    specFrom: { collection: 'robes-slippers', program: 'waffle-robe' } },
  { slug: 'feather-nest', name: 'Feather Nest', tag: 'Soft solids', folder: 'ranges/feather-nest',
    line: 'Soft, solid colours for rooms that should feel like home.',
    body: 'A calm palette of blush, camel, slate and ivory in a soft-handle terry. For serviced residences, family rooms and boutique hotels that want colour without pattern.',
    colours: 'Blush · Camel · Slate · Ivory', for: 'Residences, boutique hotels, family rooms', lead: pick('ranges/feather-nest', 'j8a0636-edit') },
  { slug: 'bamboo-safari', name: 'Bamboo Safari', tag: 'Solids & safari prints', folder: 'ranges/bamboo-safari',
    line: 'Bold solids and safari jacquards, from towel to robe to slipper.',
    body: 'Zebra, leopard and dalmatian jacquards alongside solid white, ivory, olive, rust, navy and charcoal, coordinated across towels, robes and slippers. Made for resorts, beach clubs and lodges with a personality.',
    colours: 'Zebra · Leopard · Dalmatian · 6 solids', for: 'Resorts, beach clubs, safari lodges', lead: pick('ranges/bamboo-safari', 'j8a0966-edit') },
  { slug: 'home-essence', name: 'Home Essence', tag: 'Yarn-dyed jacquards', folder: 'ranges/home-essence',
    line: 'Swirls, checks and stripes, woven into the cloth.',
    body: 'Yarn-dyed jacquards in sage, rust, navy and black, so the pattern is structural and will not fade. Proof of what our Stäubli jacquard looms can weave, and a starting point for your own design.',
    colours: 'Sage · Rust · Navy · Black', for: 'Boutique hotels, residences, retail', lead: pick('ranges/home-essence', 'j8a0538-edit') },
  { slug: 'pool-towel', name: 'Pool Towel', tag: 'Cabana stripes', folder: 'ranges/pool-towel',
    line: 'Stripes that say “pool stock” from across the deck.',
    body: 'Yarn-dyed cabana stripes in cobalt, teal and butter, plus deep solids. The colour goes in at the yarn, so the stripe survives chlorine, sun and a laundry that is not gentle.',
    colours: 'Cobalt · Teal · Butter · Forest', for: 'Pools, beach clubs, gyms', lead: pick('ranges/pool-towel', 'j8a1035-edit'),
    specFrom: { collection: 'pool-spa', program: 'cabana' } },
];

export const customisation: { group: string; items: [string, string, string][] }[] = [
  { group: 'Borders', items: [
    ['Dobby border', 'Woven band 5, 8 or 12 cm deep, tone on tone or contrast', 'No added lead time'],
    ['Satin band', '2 cm mercerised satin band, upper and lower', 'No added lead time'],
    ['Jacquard border', 'Your motif woven into the border', '+10 days · from 1,000 pcs per design'],
  ]},
  { group: 'Branding', items: [
    ['Jacquard woven logo', 'Woven into the border during weaving, permanent', '+10–14 days · from 1,000 pcs'],
    ['Embroidery', 'Up to 6 thread colours, chest or corner', '+5–7 days · from 300 pcs'],
    ['Woven label', 'Sewn side or corner label, damask or satin', '+7 days'],
    ['Pool towel print', 'Screen or heat transfer, logo or full stripe', '+5 days · from 500 pcs'],
  ]},
  { group: 'Colour', items: [
    ['Optical white', 'Standard hotel white, chlorine-stable process', 'Standard'],
    ['Piece dyed to Pantone', 'Reactive dyed to your Pantone reference', '+7 days · from 500 pcs per colour'],
    ['Yarn dyed', 'Dyed at the yarn stage for superior fastness: stripes and checks', '+14 days · from 1,000 pcs per colour'],
  ]},
  { group: 'Finish', items: [
    ['Antimicrobial', 'Odour-control finish, durable through 50 wash cycles (Intertek report TRPT26000914)', 'Optional on Signature, Select, Classic, Bamboo'],
  ]},
];

export const terms: Spec[] = [
  ['Sampling', 'Up to 3 pieces free in 10–14 days; plus 7 days for a new jacquard'],
  ['Production', '45–70 days from artwork approval and advance'],
  ['Shipping', 'FOB Chennai or Tuticorin; DDP to the GCC and UK'],
  ['Payment', '30% advance, 70% against bill of lading; LC at sight above USD 50,000'],
  ['Quality', 'AQL 2.5 major / 4.0 minor; third-party inspection welcome'],
  ['Loadability', '20 ft container ≈ 280 towel cartons; 40 ft HC ≈ 645'],
];

export const certifications = [
  ['ISO 9001:2015', 'Quality management across all units'],
  ['GOTS', 'Chain of custody for the Organic collection'],
  ['OEKO-TEX Standard 100', 'Tested for harmful substances'],
  ['SA8000:2014', 'Audited social accountability'],
];

export const process = [
  ['Requirement', 'Scope, quantities, specifications, budget and programme.'],
  ['Proposal', 'Products, materials, finishes and sourcing options recommended.'],
  ['Sample', 'Samples, lab dips, CADs and mock-ups for approval.'],
  ['Production', 'Made to the approved specification, with progress followed.'],
  ['Logistics', 'Documentation, shipment planning and delivery.'],
  ['Handover', 'Delivery, replenishment and project close-out.'],
];
