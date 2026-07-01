import type { Metadata } from "next";
import Image from "next/image";
import {
  desktopRows as fbDesktopRows,
  mobileRows as fbMobileRows,
  type Cell,
  type Item,
  type Row,
} from "./data";
import { getOverviewCells, type OverviewCell } from "../lib/sanity/queries";
import { sized } from "../lib/sanity/client";
import { packRows } from "../lib/mosaic";
import { Lightbox } from "./LightboxClient";

const ROW_GAP_PCT = 5;
const ROW_MARGIN_PCT = 5;
const GROUP_GAP_PCT = 1.5;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

function buildFromSanity(
  sanityCells: OverviewCell[]
): { desktopRows: Row[]; mobileRows: Row[]; allCells: Cell[] } {
  const cells: Cell[] = sanityCells.map((c) => {
    const items: Item[] = c.images.map((im) => ({
      src: sized(im.src, 800, 60),
      w: im.w,
      h: im.h,
      ar: round(im.w / im.h),
    }));
    if (items.length === 1) {
      return { type: "single", ar: items[0].ar, item: items[0], caption: c.caption };
    }
    return {
      type: "group",
      ar: round(items.reduce((s, i) => s + i.ar, 0)),
      items,
      caption: c.caption,
    };
  });
  const pc = cells.map((c) => ({ ar: c.ar, data: c }));
  return {
    desktopRows: packRows(pc, 1280, 64, 340, 2),
    mobileRows: packRows(pc, 390, 18, 260, 1),
    allCells: cells,
  };
}

const LIGHTBOX_CSS = `
.lightbox{position:fixed;inset:0;z-index:60;display:none;background-color:var(--white-smoke)}
.lightbox:target{display:flex}
.lb-prev{cursor:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Cpath%20d='M20%208L12%2016L20%2024'%20fill='none'%20stroke='white'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M20%208L12%2016L20%2024'%20fill='none'%20stroke='%23141210'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") 16 16, w-resize}
.lb-next{cursor:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='32'%20height='32'%20viewBox='0%200%2032%2032'%3E%3Cpath%20d='M12%208L20%2016L12%2024'%20fill='none'%20stroke='white'%20stroke-width='4'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3Cpath%20d='M12%208L20%2016L12%2024'%20fill='none'%20stroke='%23141210'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E") 16 16, e-resize}
`;

function HoverOverlay({ caption }: { caption?: string }) {
  if (!caption) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 pointer-events-none z-10">
      <span
        className="text-[var(--brand-black)]"
        style={{
          fontFamily: "var(--font-bodoni), serif",
          fontSize: "clamp(13px, 1.1vw, 16px)",
          letterSpacing: "0.01em",
        }}
      >
        {caption}
      </span>
    </div>
  );
}

function HoverBorder() {
  return (
    <div className="absolute inset-0 border border-transparent group-hover/card:border-[var(--brand-black)] transition-colors duration-300 pointer-events-none z-20" />
  );
}

function ImageTile({ item }: { item: Item }) {
  return (
    <Image
      src={item.src}
      alt="Still life photograph by Samuel Bristow"
      width={item.w}
      height={item.h}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      sizes="50vw"
    />
  );
}

function CellTile({ cell, cellIdx }: { cell: Cell; cellIdx: number }) {
  if (cell.type === "single") {
    return (
      <a
        href={`#ov-lb-${cellIdx}`}
        className="group/card relative overflow-hidden block h-full min-w-0"
        style={{ flex: `${cell.ar} 0 0` }}
      >
        <ImageTile item={cell.item} />
        <HoverOverlay caption={cell.caption} />
        <HoverBorder />
      </a>
    );
  }
  return (
    <a
      href={`#ov-lb-${cellIdx}`}
      className="group/card relative flex h-full min-w-0"
      style={{ flex: `${cell.ar} 0 0`, gap: `${GROUP_GAP_PCT}%` }}
    >
      {cell.items.map((it, i) => (
        <div
          key={i}
          className="min-w-0 overflow-hidden"
          style={{ flex: `${it.ar} 0 0`, height: "100%" }}
        >
          <ImageTile item={it} />
        </div>
      ))}
      <HoverOverlay caption={cell.caption} />
      <HoverBorder />
    </a>
  );
}

function MosaicGrid({
  rows,
  rowGap = ROW_GAP_PCT,
  rowMargin = ROW_MARGIN_PCT,
  packWidth,
  packGap,
  maxH,
}: {
  rows: Row[];
  rowGap?: number;
  rowMargin?: number;
  packWidth: number;
  packGap: number;
  maxH: number;
}) {
  let idx = 0;
  return (
    <>
      {rows.map((row, ri) => {
        const ar = row.ar / (1 - (rowGap / 100) * (row.cells.length - 1));
        const naturalH = (packWidth - packGap * (row.cells.length - 1)) / row.ar;
        const widthPct = naturalH > maxH ? (maxH / naturalH) * 100 : 100;
        return (
          <div
            key={ri}
            className="flex mr-auto"
            style={{
              width: `${widthPct}%`,
              aspectRatio: ar,
              gap: `${rowGap}%`,
              marginBottom: `${rowMargin}%`,
            }}
          >
            {row.cells.map((cell, ci) => {
              const cellIdx = idx++;
              return <CellTile key={ci} cell={cell} cellIdx={cellIdx} />;
            })}
          </div>
        );
      })}
    </>
  );
}

// Lightbox is now imported from LightboxClient.tsx

export const metadata: Metadata = {
  title: "Portfolio Overview",
  description:
    "Browse the complete portfolio of still life, product, beauty and fragrance photography by New York–based photographer and director Samuel Bristow.",
  alternates: { canonical: "/overview" },
  openGraph: {
    title: "Portfolio Overview — Samuel Bristow",
    description:
      "Browse the complete portfolio of still life, product, beauty and fragrance photography by New York–based photographer and director Samuel Bristow.",
    url: "/overview",
  },
};

export async function OverviewSection({ id }: { id?: string }) {
  const sanityCells = await getOverviewCells();
  const { desktopRows, mobileRows, allCells } = sanityCells
    ? buildFromSanity(sanityCells)
    : {
        desktopRows: fbDesktopRows,
        mobileRows: fbMobileRows,
        allCells: fbDesktopRows.flatMap((r) => r.cells),
      };

  return (
    <section
      id={id}
      className="pt-[88px] md:pt-[130px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: LIGHTBOX_CSS }} />

      <div
        className="section-name sticky z-20 text-center pb-[1em] md:pb-[2em]"
        style={{ top: 0, paddingTop: "clamp(63px, 7.5vw, 93px)" }}
      >
        <span
          style={{
            fontFamily: '"psfournier-std", serif',
            fontSize: "clamp(18px, 1.7vw, 23px)",
            fontWeight: 300,
            letterSpacing: "0.01em",
            lineHeight: "1.6",
          }}
        >
          Overview
        </span>
      </div>

      <div className="px-3 md:hidden">
        <MosaicGrid
          rows={mobileRows}
          rowGap={16}
          rowMargin={16}
          packWidth={390}
          packGap={18}
          maxH={260}
        />
      </div>

      <div className="hidden md:block px-6 lg:px-10 max-w-[1400px] mx-auto">
        <MosaicGrid rows={desktopRows} packWidth={1280} packGap={64} maxH={340} />
      </div>

      {allCells.map((cell, i) => (
        <Lightbox key={i} cell={cell} index={i} total={allCells.length} />
      ))}
    </section>
  );
}

export default function OverviewPage() {
  return (
    <main>
      <OverviewSection />
    </main>
  );
}
