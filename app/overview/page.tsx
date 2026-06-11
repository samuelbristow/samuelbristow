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

const ROW_GAP_PCT = 5;
const ROW_MARGIN_PCT = 5;
const GROUP_GAP_PCT = 1.5;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

function buildFromSanity(
  sanityCells: OverviewCell[]
): { desktopRows: Row[]; mobileRows: Row[]; allCells: Cell[] } {
  const cells: Cell[] = sanityCells.map((c) => {
    const items: Item[] = c.images.map((im) => ({
      src: sized(im.src, 1280),
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

function LightboxImage({ item }: { item: Item }) {
  return (
    <img
      src={item.src}
      alt="Still life photograph by Samuel Bristow"
      loading="lazy"
      decoding="async"
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}

function Lightbox({
  cell,
  index,
  total,
}: {
  cell: Cell;
  index: number;
  total: number;
}) {
  const prev = (index - 1 + total) % total;
  const next = (index + 1) % total;

  const btnBase =
    "absolute z-30 flex items-center justify-center text-[var(--brand-black)] no-underline";

  return (
    <div id={`ov-lb-${index}`} className="lightbox">
      <div
        className="absolute top-0 left-0 right-0 z-30 text-center pointer-events-none"
        style={{
          backgroundColor: "var(--white-smoke)",
          padding: "20px 36px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontSize: "clamp(13px, 1.3vw, 16px)",
            lineHeight: "1.5",
            letterSpacing: "0.01em",
          }}
        >
          <strong style={{ fontWeight: 600 }}>Samuel Bristow</strong>
          <span style={{ opacity: 0.6 }}>
            {" "}
            / Overview{cell.caption ? ` / ${cell.caption}` : ""}
          </span>
        </h2>
      </div>

      <a
        href={`#ov-lb-${prev}`}
        aria-label="Previous"
        className={`${btnBase} top-0 left-0`}
        style={{ width: "30%", height: "100%" }}
      />
      <a
        href={`#ov-lb-${next}`}
        aria-label="Next"
        className={`${btnBase} top-0 right-0`}
        style={{ width: "30%", height: "100%" }}
      />

      <a
        href="#!"
        aria-label="Close"
        className={`${btnBase} z-40 leading-none hover:opacity-60 transition-opacity`}
        style={{
          top: "4px",
          right: "8px",
          width: "44px",
          height: "44px",
          fontFamily: "var(--font-bodoni), serif",
          fontSize: "30px",
        }}
      >
        ×
      </a>

      <div
        className="absolute left-0 right-0 flex items-center justify-center px-0 md:px-[120px] pointer-events-none"
        style={{ top: "70px", bottom: "70px" }}
      >
        {cell.type === "single" ? (
          <LightboxImage item={cell.item} />
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              gap: "1.5%",
              width: "100%",
              height: "100%",
              maxWidth: "100%",
            }}
          >
            {cell.items.map((it, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{ flex: `${it.ar} 1 1 0`, minWidth: 0, height: "100%" }}
              >
                <img
                  src={it.src}
                  alt="Still life photograph by Samuel Bristow"
                  loading="lazy"
                  decoding="async"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-30 text-center pointer-events-none"
        style={{
          padding: "20px 36px",
          color: "var(--brand-black)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontSize: "clamp(12px, 1.2vw, 15px)",
            letterSpacing: "0.04em",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

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
