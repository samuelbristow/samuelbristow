export type GalleryImg = { src: string; w: number; h: number };

export type Item =
  | { type: "image"; id: string; href: string; image: string; width: number; height: number; landscape?: boolean; caption?: string; gallery?: GalleryImg[] }
  | { type: "gif"; id: string; href: string; image: string; width: number; height: number; landscape?: boolean; caption?: string; gallery?: GalleryImg[] }
  | { type: "video"; id: string; href: string; src: string; width?: number; height?: number; landscape?: boolean; caption?: string; gallery?: GalleryImg[] };

export type Placed = { item: Item; align: string };

export const FALLBACK_ITEMS: Item[] = [
  { type: "video", id: "hero", href: "/projects/calderalab", src: "/assets/hero.mp4" },
  { type: "image", id: "ch-1", href: "/projects/chanel", image: "/assets/images/chanel/1.jpg", width: 750, height: 1000 },
  { type: "gif", id: "gif-1", href: "/projects/eucalyptus", image: "/assets/images/Eucalyptusrain5-ezgif.com-video-to-gif-converter.gif", width: 400, height: 500 },
  { type: "image", id: "prada-1", href: "/projects/prada", image: "/assets/images/Prada+green+intro.jpg.webp", width: 2200, height: 1467, landscape: true },
  { type: "image", id: "tk-1", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/1.jpg", width: 750, height: 1000 },
  { type: "image", id: "cl-1", href: "/projects/calderalab", image: "/assets/images/calderalab/1.jpg", width: 750, height: 1000 },
  { type: "image", id: "ck-1", href: "/projects/ck-eternity", image: "/assets/images/CK+Eternity+intro+1.jpg.webp", width: 1800, height: 1200, landscape: true },
  { type: "image", id: "ch-2", href: "/projects/chanel", image: "/assets/images/chanel/2.jpg", width: 750, height: 1000 },
  { type: "image", id: "tk-2", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/2.jpg", width: 2500, height: 3333 },
  { type: "image", id: "cl-2", href: "/projects/calderalab", image: "/assets/images/calderalab/2.jpg", width: 750, height: 1000 },
  { type: "image", id: "christina-1", href: "/projects/christina", image: "/assets/images/Christina+test_intro.jpg.webp", width: 2200, height: 1467, landscape: true },
  { type: "image", id: "ch-3", href: "/projects/chanel", image: "/assets/images/chanel/3.jpg", width: 750, height: 1000 },
  { type: "gif", id: "gif-2", href: "/projects/campaign", image: "/assets/images/ezgif-3-b506754c48.gif", width: 750, height: 422, landscape: true },
  { type: "image", id: "tk-3", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/3.jpg", width: 2500, height: 3333 },
  { type: "image", id: "cl-3", href: "/projects/calderalab", image: "/assets/images/calderalab/3.jpg", width: 750, height: 1000 },
  { type: "image", id: "ch-4", href: "/projects/chanel", image: "/assets/images/chanel/4.jpg", width: 750, height: 1000 },
  { type: "image", id: "tk-4", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/4.jpg", width: 2500, height: 3333 },
  { type: "image", id: "cl-4", href: "/projects/calderalab", image: "/assets/images/calderalab/4.jpg", width: 500, height: 666 },
  { type: "image", id: "tk-5", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/5.jpg", width: 1500, height: 2000 },
  { type: "image", id: "cl-5", href: "/projects/calderalab", image: "/assets/images/calderalab/5.jpg", width: 750, height: 1000 },
  { type: "image", id: "tk-6", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/6.jpg", width: 1500, height: 2000 },
];

export const isFullWidth = (item: Item) => {
  if (item.type === "video") return true;
  const ar = (item.width ?? 0) / (item.height ?? 1);
  if (ar > 0 && ar < 1) return false;
  if (item.landscape) return true;
  return ar > 1.1;
};

export const itemAr = (item: Item) =>
  item.type === "video"
    ? (item.width || 1276) / (item.height || 720)
    : item.width / item.height;

function alignClass(n: number) {
  const m = n % 3;
  if (m === 0) return "md:ml-auto md:mr-0";
  if (m === 1) return "md:mr-auto md:ml-0";
  return "md:mx-auto";
}

export function buildColumns(list: Item[]): [Placed[], Placed[]] {
  const cols: [Placed[], Placed[]] = [[], []];
  const heights = [0, 0];
  list.forEach((item, i) => {
    const wFrac = isFullWidth(item) ? 1 : 0.62;
    const h = wFrac / itemAr(item) + 0.4;
    const c = heights[0] <= heights[1] ? 0 : 1;
    cols[c].push({ item, align: alignClass(i) });
    heights[c] += h;
  });
  return cols;
}
