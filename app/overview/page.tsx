"use client";

import Image from "next/image";
import Link from "next/link";
import { desktopRows, mobileRows, type Cell, type Item, type Row } from "./data";

const ROW_GAP_PCT = 5;
const ROW_MARGIN_PCT = 5;
const GROUP_GAP_PCT = 1.5;

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

function ImageTile({ item }: { item: Item }) {
  return (
    <Image
      src={item.src}
      alt=""
      width={item.w}
      height={item.h}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      sizes="50vw"
    />
  );
}

function HoverBorder() {
  return (
    <div className="absolute inset-0 border border-transparent group-hover/card:border-[var(--brand-black)] transition-colors duration-300 pointer-events-none z-20" />
  );
}

function CellLink({ cell }: { cell: Cell }) {
  if (cell.type === "single") {
    return (
      <Link
        href="#"
        className="group/card relative overflow-hidden block h-full min-w-0"
        style={{ flex: `${cell.ar} 0 0` }}
      >
        <ImageTile item={cell.item} />
        <HoverOverlay />
        <HoverBorder />
      </Link>
    );
  }
  return (
    <Link
      href="#"
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
      <HoverOverlay />
      <HoverBorder />
    </Link>
  );
}

function MosaicRow({ row }: { row: Row }) {
  const ar = row.ar / (1 - (ROW_GAP_PCT / 100) * (row.cells.length - 1));
  return (
    <div
      className="flex w-full"
      style={{
        aspectRatio: ar,
        gap: `${ROW_GAP_PCT}%`,
        marginBottom: `${ROW_MARGIN_PCT}%`,
      }}
    >
      {row.cells.map((cell, ci) => (
        <CellLink key={ci} cell={cell} />
      ))}
    </div>
  );
}

export default function Overview() {
  return (
    <main
      className="pt-[120px] md:pt-[180px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <div
        className="section-name sticky z-20 text-center pb-[2em] md:pb-[4em]"
        style={{ top: 0, paddingTop: "clamp(63px, 7.5vw, 93px)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            letterSpacing: "0.01em",
            lineHeight: "1.6",
          }}
        >
          Overview
        </span>
      </div>

      <div className="px-3 md:hidden">
        {mobileRows.map((row, ri) => (
          <MosaicRow key={ri} row={row} />
        ))}
      </div>

      <div className="hidden md:block px-6 lg:px-10 max-w-[1400px] mx-auto">
        {desktopRows.map((row, ri) => (
          <MosaicRow key={ri} row={row} />
        ))}
      </div>
    </main>
  );
}
