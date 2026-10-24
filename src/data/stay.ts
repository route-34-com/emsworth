// The Stay: a guest's day at the hotel, hour by hour, and the textiles behind each moment.
// h = [plain words, italic words]. reveal = how the photo opens. Photos are shoot folder/file pairs.

export type Moment = {
  t: string; part: string; h: [string, string]; p: string;
  img: [string, string]; focus: string; items: [string, string][];
  reveal?: 'curtain' | 'rise' | 'circle';
  /** A resort clip (public/video/<name>.mp4, with <name>.jpg as its still) that plays in place of the photo. */
  video?: string;
  /** Full-screen clip: which side the words sit on, away from the person. */
  side?: 'left' | 'right';
  /** Optional zoom on the full-screen clip and the point it grows from, to move the person clear of the words. */
  zoom?: number; origin?: string;
  /** A narrower column of words, for clips where the person takes most of the frame. */
  narrow?: boolean;
};

export const morning: Moment[] = [
  { t: '07:00', part: 'Waking up', h: ['Into a robe,', 'feet into slippers.'], reveal: 'rise',
    p: 'Waffle or terry robes in the guest’s size, and slippers waiting by the bed.',
    img: ['outdoor/s2', 'j8a1127-edit'], video: 'c7103', side: 'left', focus: '50% 0%', items: [['Bathrobes', '/lookbook/robe/'], ['Slippers', '/lookbook/slipper/']] },
  { t: '07:30', part: 'The bathroom', h: ['Soft towels,', 'warm light.'], reveal: 'rise',
    p: 'Bath sheet, bath, hand and face towels from 420 to 700 GSM, with a woven bath mat underfoot.',
    img: ['outdoor/s1', 'j8a1104-edit'], video: 'c7058', side: 'left', focus: '60% 40%', items: [['Bath & face towels', '/lookbook/bath/'], ['Hand towels', '/lookbook/hand/'], ['Bath mats', '/lookbook/mat/']] },
  { t: '09:00', part: 'Breakfast', h: ['Linen', 'on the table.'], reveal: 'rise',
    p: 'Tablecloths and napkins in your colours, folded and pressed for the breakfast room.',
    img: ['napkin', 'j8a2557'], focus: '40% 50%', items: [['Table linen', '/lookbook/table/']] },
  { t: '12:00', part: 'By the pool', h: ['Stripes', 'by the water.'], reveal: 'rise',
    p: 'Cabana-stripe pool towels, quick to spot and quick to dry, laid out on every lounger by noon.',
    img: ['ranges/pool-towel', 'j8a1036-edit'], video: 'c7233', side: 'left', focus: '50% 50%', items: [['Pool & beach', '/lookbook/pool/']] },
];

/** The afternoon, before dusk. */
export const late: Moment[] = [
  { t: '14:00', part: 'The long afternoon', h: ['Lazy hours,', 'a robe in the breeze.'], reveal: 'rise',
    p: 'Light robes in prints and plains for the pool deck and the walk back to the room, soft enough to live in all afternoon.',
    img: ['outdoor/s1', 'j8a1066-edit'], video: 'c7065', side: 'right', narrow: true, focus: '50% 0%', items: [['Bathrobes', '/lookbook/robe/']] },
  { t: '16:00', part: 'The spa', h: ['A slower', 'afternoon.'], reveal: 'rise',
    p: 'Spa towels in soft, warm colours, and hand towels rolled and banded for the treatment rooms.',
    img: ['outdoor/s1', 'j8a1066-edit'], video: 'c7199', side: 'left', focus: '50% 30%', items: [['Hand towels', '/lookbook/hand/'], ['Bathrobes', '/lookbook/robe/']] },
];

export const evening: Moment[] = [
  { t: '19:30', part: 'Dinner', h: ['Polished glass,', 'a woven napkin.'], reveal: 'rise',
    p: 'Napkins with your name woven in, and glass cloths that leave nothing behind on the crystal.',
    img: ['napkin', 'j8a2603'], focus: '60% 50%', items: [['Table linen', '/lookbook/table/'], ['Glass cloths', '/lookbook/glass/']] },
  { t: '22:00', part: 'Turndown', h: ['A bed', 'made for sleep.'], reveal: 'rise',
    p: 'Percale and sateen sheets from 200 to 400 thread count, turned down with the slippers set out.',
    img: ['outdoor/s2', 'j8a1141-edit'], video: 'c7196', side: 'left', narrow: true, focus: '50% 20%', items: [['Bed linen', '/lookbook/bed/'], ['Slippers', '/lookbook/slipper/']] },
];
