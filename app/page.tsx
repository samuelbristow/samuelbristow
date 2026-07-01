import { HomeGrid } from "./components/HomeGrid";
import { buildColumns, FALLBACK_ITEMS, type Item } from "./lib/home";
import { getHomeItems, getPreloaderImages, type Media } from "./lib/sanity/queries";
import { sized } from "./lib/sanity/client";
import { OverviewSection } from "./overview/page";
import { MotionSection } from "./motion/page";
import { AboutSection } from "./about/page";
import { StudioSection } from "./studio/page";

function toItem(m: Media, i: number): Item {
  const id = `home-${i}`;
  const href = m.link || "#";
  const gallery =
    m.gallery && m.gallery.length
      ? m.gallery.map((g) => ({
          thumb: sized(g.src, 600, 60),
          src: sized(g.src, 1600),
          w: g.w,
          h: g.h,
        }))
      : undefined;
  if (m.type === "video") {
    return { type: "video", id, href, src: m.src, width: m.width, height: m.height, landscape: m.landscape, caption: m.caption, gallery };
  }
  const isGif = /\.gif($|\?)/i.test(m.src);
  return {
    type: isGif ? "gif" : "image",
    id,
    href,
    image: sized(m.src, 800, 65),
    width: m.width,
    height: m.height,
    landscape: m.landscape,
    caption: m.caption,
    gallery,
  };
}

export default async function Home() {
  const sanity = await getHomeItems();
  const items =
    sanity && sanity.length ? sanity.map(toItem) : FALLBACK_ITEMS;
  const [colA, colB] = buildColumns(items);

  const preRaw = await getPreloaderImages();
  const preloaderImages = preRaw
    ? preRaw.map((i) => ({ src: sized(i.src, 800, 60), w: i.w, h: i.h }))
    : undefined;

  return (
    <main>
      <HomeGrid
        items={items}
        colA={colA}
        colB={colB}
        preloaderImages={preloaderImages}
      />
      <OverviewSection id="overview" />
      <MotionSection id="motion" />
      <AboutSection id="about" />
      <StudioSection id="studio" />
    </main>
  );
}
