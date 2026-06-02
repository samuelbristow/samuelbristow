import { desktopRows, mobileRows, type Cell, type Media, type Row } from "./data";

const ROW_GAP_PCT = 5;
const ROW_MARGIN_PCT = 5;

const allCells: Cell[] = desktopRows.flatMap((row) => row.cells);

const LIGHTBOX_CSS = `
.lightbox{position:fixed;inset:0;z-index:60;display:none;background-color:var(--white-smoke)}
.lightbox:target{display:flex}
`;

function HoverOverlay() {
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
        Client
      </span>
    </div>
  );
}

function HoverBorder() {
  return (
    <div className="absolute inset-0 border border-transparent group-hover/card:border-[var(--brand-black)] transition-colors duration-300 pointer-events-none z-20" />
  );
}

function MediaTile({ item }: { item: Media }) {
  if (item.kind === "video") {
    return (
      <video
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  return (
    <img
      src={item.src}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

function CellTile({ cell, cellIdx }: { cell: Cell; cellIdx: number }) {
  return (
    <a
      href={`#lb-${cellIdx}`}
      className="group/card relative overflow-hidden block h-full min-w-0"
      style={{ flex: `${cell.ar} 0 0` }}
    >
      <MediaTile item={cell.item} />
      <HoverOverlay />
      <HoverBorder />
    </a>
  );
}

function MosaicGrid({
  rows,
  rowGap = ROW_GAP_PCT,
  rowMargin = ROW_MARGIN_PCT,
}: {
  rows: Row[];
  rowGap?: number;
  rowMargin?: number;
}) {
  let idx = 0;
  return (
    <>
      {rows.map((row, ri) => {
        const ar = row.ar / (1 - (rowGap / 100) * (row.cells.length - 1));
        return (
          <div
            key={ri}
            className="flex w-full"
            style={{
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

function LightboxMedia({ item }: { item: Media }) {
  if (item.kind === "video") {
    return (
      <video
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
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
  return (
    <img
      src={item.src}
      alt=""
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
    <div id={`lb-${index}`} className="lightbox">
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
          <span style={{ opacity: 0.6 }}> / Motion / Client</span>
        </h2>
      </div>

      <a
        href={`#lb-${prev}`}
        aria-label="Previous"
        className={`${btnBase} top-0 left-0`}
        style={{ width: "30%", height: "100%" }}
      />
      <a
        href={`#lb-${next}`}
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
        <LightboxMedia item={cell.item} />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-30 text-center pointer-events-none"
        style={{ padding: "20px 36px", color: "var(--brand-black)" }}
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

export default function Motion() {
  return (
    <main
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
            fontSize: "clamp(13px, 1.2vw, 15px)",
            fontWeight: 300,
            letterSpacing: "0.01em",
            lineHeight: "1.6",
          }}
        >
          Motion
        </span>
      </div>

      <div className="px-3 md:hidden">
        <MosaicGrid rows={mobileRows} rowGap={16} rowMargin={16} />
      </div>

      <div className="hidden md:block px-6 lg:px-10 max-w-[1400px] mx-auto">
        <MosaicGrid rows={desktopRows} />
      </div>

      {allCells.map((cell, i) => (
        <Lightbox key={i} cell={cell} index={i} total={allCells.length} />
      ))}
    </main>
  );
}
