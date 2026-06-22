"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Preloader } from "./Preloader";
import { isFullWidth, type Item, type Placed } from "../lib/home";

type PreImg = { src: string; w: number; h: number };

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HLB_CSS = `
.hlb{position:fixed;inset:0;z-index:70;display:none;overflow-y:auto;overscroll-behavior:contain;background-color:var(--white-smoke)}
.hlb:target{display:block}
.hlb-one{position:fixed;inset:0;z-index:70;display:none;background-color:var(--white-smoke)}
.hlb-one:target{display:block}
`;

function MediaCard({ item, align }: { item: Item; align: string }) {
  const full = isFullWidth(item);
  const opensLightbox = !!(item.gallery && item.gallery.length) || item.type !== "video";
  const cls = `group/card relative block mx-auto ${align}`;
  const styleW = {
    width: full ? "var(--item-w-full, 92%)" : "var(--item-w, 75%)",
  };

  const media = (
    <>
      {item.type === "video" ? (
        <video
          src={item.src}
          data-grid-video
          muted
          loop
          playsInline
          preload="none"
          style={{ width: "100%", height: "auto" }}
          className="block"
        />
      ) : (
        <Image
          src={item.image}
          alt={item.caption || "Still life photograph by Samuel Bristow"}
          width={item.width}
          height={item.height}
          unoptimized={item.type === "gif"}
          style={{ width: "100%", height: "auto" }}
          className="block"
          sizes="(max-width: 767px) 85vw, 30vw"
        />
      )}

      {item.caption ? (
        <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 pointer-events-none">
          <span
            className="text-[var(--brand-black)]"
            style={{
              fontFamily: "var(--font-bodoni), serif",
              fontSize: "clamp(20px, 2vw, 26px)",
              letterSpacing: "0.01em",
            }}
          >
            {item.caption}
          </span>
        </div>
      ) : null}
    </>
  );

  return (
    <div data-item className="mb-[6em] md:mb-[12em] lg:mb-[15em]">
      {opensLightbox ? (
        <a href={`#home-lb-${item.id}`} className={cls} style={styleW}>
          {media}
        </a>
      ) : (
        <Link href={item.href} className={cls} style={styleW}>
          {media}
        </Link>
      )}

      {item.caption ? (
        <div className="md:hidden mt-3 mx-auto" style={styleW}>
          <span
            className="block text-center text-[var(--brand-black)]"
            style={{
              fontFamily: "var(--font-bodoni), serif",
              fontSize: "16px",
              letterSpacing: "0.01em",
            }}
          >
            {item.caption}
          </span>
        </div>
      ) : null}
    </div>
  );
}

const LB_TITLE_STYLE: React.CSSProperties = {
  fontFamily: '"psfournier-std", serif',
  fontWeight: 300,
  fontSize: "clamp(14px, 1.4vw, 18px)",
  letterSpacing: "0.15em",
};

function LightboxHeader({
  caption,
  absolute = false,
  toggle,
}: {
  caption?: string;
  absolute?: boolean;
  toggle?: { href: string; label: string };
}) {
  return (
    <div
      className={`${
        absolute ? "absolute top-0 left-0 right-0" : "sticky top-0"
      } z-30 px-5 md:px-10 lg:px-[120px] py-4 pointer-events-none`}
      style={{ backgroundColor: "var(--white-smoke)" }}
    >
      <div className="relative flex items-center justify-between gap-4">
        <span style={LB_TITLE_STYLE}>
          Samuel<span style={{ marginLeft: "0.15em" }}>Bristow</span>
          {caption ? (
            <span
              style={{
                fontFamily: "var(--font-bodoni), serif",
                letterSpacing: "0.02em",
                opacity: 0.55,
                marginLeft: "0.5em",
              }}
            >
              / {caption}
            </span>
          ) : null}
        </span>
        <a
          href="#!"
          aria-label="Close"
          className="pointer-events-auto leading-none hover:opacity-60 transition-opacity"
          style={{ fontFamily: "var(--font-bodoni), serif", fontSize: "30px" }}
        >
          ×
        </a>
      </div>
      {toggle ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <a
            href={toggle.href}
            className="pointer-events-auto hover:opacity-60 transition-opacity whitespace-nowrap"
            style={LB_TITLE_STYLE}
          >
            {toggle.label}
          </a>
        </div>
      ) : null}
    </div>
  );
}

function GalleryLightbox({ item }: { item: Item }) {
  const gallery = item.gallery;
  if (!gallery || !gallery.length) return null;
  const base = `home-lb-${item.id}`;
  const total = gallery.length;

  return (
    <>
      <div id={base} className="hlb">
        <LightboxHeader
          caption={item.caption}
          toggle={{ href: `#${base}-0`, label: "Single" }}
        />
        <div className="px-5 md:px-10 lg:px-[120px] pb-[6em] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-[1400px] mx-auto">
          {gallery.map((g, i) => (
            <a key={i} href={`#${base}-${i}`} className="block">
              <img
                src={g.thumb}
                data-gallery-thumb
                alt={item.caption || "Samuel Bristow photograph"}
                width={g.w}
                height={g.h}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "auto" }}
                className="block"
              />
            </a>
          ))}
        </div>
      </div>

      {gallery.map((g, i) => {
        const prev = (i - 1 + total) % total;
        const next = (i + 1) % total;
        return (
          <div key={i} id={`${base}-${i}`} className="hlb-one">
            <LightboxHeader
              caption={item.caption}
              absolute
              toggle={{ href: `#${base}`, label: "All" }}
            />
            <a
              href={`#${base}-${prev}`}
              aria-label="Previous"
              className="absolute top-0 left-0 z-20"
              style={{ width: "30%", height: "100%" }}
            />
            <a
              href={`#${base}-${next}`}
              aria-label="Next"
              className="absolute top-0 right-0 z-20"
              style={{ width: "30%", height: "100%" }}
            />
            <div
              className="absolute left-0 right-0 flex items-center justify-center px-5 md:px-[120px] pointer-events-none"
              style={{ top: "70px", bottom: "70px" }}
            >
              <img
                src={g.src}
                alt={item.caption || "Samuel Bristow photograph"}
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
            <div className="absolute bottom-0 left-0 right-0 z-30 text-center pointer-events-none py-4">
              <span
                style={{
                  fontFamily: "var(--font-bodoni), serif",
                  fontSize: "clamp(12px, 1.2vw, 15px)",
                  letterSpacing: "0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

function SingleImageLightbox({ item }: { item: Item }) {
  if (item.type === "video") return null;
  return (
    <div id={`home-lb-${item.id}`} className="hlb-one">
      <LightboxHeader caption={item.caption} absolute />
      <a href="#!" aria-label="Close" className="absolute inset-0 z-10" />
      <div
        className="absolute left-0 right-0 flex items-center justify-center px-5 md:px-[120px] pointer-events-none"
        style={{ top: "70px", bottom: "70px" }}
      >
        <img
          src={item.image}
          alt={item.caption || "Still life photograph by Samuel Bristow"}
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
    </div>
  );
}

export function HomeGrid({
  items,
  colA,
  colB,
  preloaderImages,
}: {
  items: Item[];
  colA: Placed[];
  colB: Placed[];
  preloaderImages?: PreImg[];
}) {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });
    },
    { scope: mainRef }
  );

  return (
    <section
      id="latest"
      ref={mainRef}
      className="pt-[120px] md:pt-[180px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <Preloader images={preloaderImages} />
      <style dangerouslySetInnerHTML={{ __html: HLB_CSS }} />
      <div
        className="section-name sticky z-20 text-center pb-[2em] md:pb-[4em]"
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
          Latest Series
        </span>
      </div>

      <div className="md:hidden px-10">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} align="mx-auto" />
        ))}
      </div>

      <div className="hidden md:flex gap-[7em] lg:gap-[10em] px-16 lg:px-[120px]">
        <div className="flex-1 min-w-0 flex flex-col">
          {colA.map(({ item, align }) => (
            <MediaCard key={item.id} item={item} align={align} />
          ))}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {colB.map(({ item, align }) => (
            <MediaCard key={item.id} item={item} align={align} />
          ))}
        </div>
      </div>

      {items.map((item) =>
        item.gallery && item.gallery.length ? (
          <GalleryLightbox key={item.id} item={item} />
        ) : item.type === "video" ? null : (
          <SingleImageLightbox key={item.id} item={item} />
        )
      )}
    </section>
  );
}
