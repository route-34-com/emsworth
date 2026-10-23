// Every photo from the Emsworth shoot, indexed by folder. Pages pick from here,
// so each of the 443 images appears somewhere on the site.

export type Photo = { src: ImageMetadata; file: string; folder: string };

const all = import.meta.glob<{ default: ImageMetadata }>('../assets/shoot/**/*.jpg', { eager: true });

export const photos: Photo[] = Object.entries(all)
  .map(([path, mod]) => {
    const rel = path.replace('../assets/shoot/', '');
    return { src: mod.default, file: rel.split('/').pop()!.replace('.jpg', ''), folder: rel.slice(0, rel.lastIndexOf('/')) };
  })
  .sort((a, b) => a.folder.localeCompare(b.folder) || a.file.localeCompare(b.file));

/** Photos in a folder; `deep` also includes subfolders (e.g. a range's hand shots). */
export const inFolder = (folder: string, deep = false) =>
  photos.filter((p) => p.folder === folder || (deep && p.folder.startsWith(folder + '/')));

/** One photo by folder and file name (without extension). */
export const pick = (folder: string, file: string) => {
  const p = photos.find((x) => x.folder === folder && x.file === file);
  if (!p) throw new Error(`Missing photo ${folder}/${file}`);
  return p.src;
};

/** Hospitality close-ups, split by what they show. */
const hc = (ids: number[]) => ids.map((n) => pick('hospitality-closeup', `j8a${n}`));
export const closeups = {
  bath: hc([2403, 2404, 2411, 2415, 2419, 2420, 2421, 2423, 2426, 2428, 2430, 2431, 2432, 2433, 2436, 2438, 2444, 2447, 2450, 2453, 2460, 2462, 2464, 2466, 2467, 2483, 2487]),
  pool: hc([2470, 2471, 2475, 2476, 2497, 2499, 2500, 2505, 2509]),
  robe: hc([2490, 2492, 2495, 2496]),
  bed: hc([2512, 2514, 2516, 2518, 2521, 2522, 2524, 2525, 2527]),
};

export const FOLDER_LABELS: Record<string, string> = {
  'outdoor': 'On location',
  'web-banner': 'Campaign',
  'ranges': 'The ranges',
  'product-sku': 'Folded & finished',
  'product-closeup': 'Pattern library',
  'hospitality-closeup': 'Hotel white close-ups',
  'slipper-robe': 'Robes, slippers & packaging',
  'napkin': 'Table linen',
  'hand-towel': 'In the hand',
  'face-towel': 'Face towels',
};
