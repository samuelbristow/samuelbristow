import { HomeGrid } from "./components/HomeGrid";
import { buildColumns, FALLBACK_ITEMS, type Item } from "./lib/home";
import { getHomeItems, type Media } from "./lib/sanity/queries";
import { sized } from "./lib/sanity/client";

function toItem(m: Media, i: number): Item {
  const id = `home-${i}`;
  const href = m.link || "#";
  if (m.type === "video") {
    return { type: "video", id, href, src: m.src, width: m.width, height: m.height, landscape: m.landscape };
  }
  const isGif = /\.gif($|\?)/i.test(m.src);
  return {
    type: isGif ? "gif" : "image",
    id,
    href,
    image: sized(m.src, 1280),
    width: m.width,
    height: m.height,
    landscape: m.landscape,
  };
}

export default async function Home() {
  const sanity = await getHomeItems();
  const items =
    sanity && sanity.length ? sanity.map(toItem) : FALLBACK_ITEMS;
  const [colA, colB] = buildColumns(items);

  return <HomeGrid items={items} colA={colA} colB={colB} />;
}
