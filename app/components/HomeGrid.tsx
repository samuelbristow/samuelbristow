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
.hlb{position:fixed;inset:0;z-index:70;display:none;overflow-y:auto;background-color:var(--white-smoke)}
.hlb:target{display:block}
`;

function MediaCard({ item, align }: { item: Item; align: string }) {
  const full = isFullWidth(item);
  const hasGallery = !!(item.gallery && item.gallery.length);
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
      {hasGallery ? (
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

function GalleryLightbox({ item }: { item: Item }) {
  const gallery = item.gallery;
  if (!gallery || !gallery.length) return null;
  return (
    <div id={`home-lb-${item.id}`} className="hlb">
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-10 lg:px-[120px] py-4"
        style={{ backgroundColor: "var(--white-smoke)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontSize: "clamp(13px, 1.3vw, 16px)",
            letterSpacing: "0.01em",
          }}
        >
          <strong style={{ fontWeight: 600 }}>Samuel Bristow</strong>
          {item.caption ? (
            <span style={{ opacity: 0.6 }}> / {item.caption}</span>
          ) : null}
        </span>
        <a
          href="#!"
          aria-label="Close"
          className="leading-none hover:opacity-60 transition-opacity"
          style={{ fontFamily: "var(--font-bodoni), serif", fontSize: "30px" }}
        >
          ×
        </a>
      </div>

      <div className="px-5 md:px-10 lg:px-[120px] pb-[6em] grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-[1400px] mx-auto">
        {gallery.map((g, i) => (
          <img
            key={i}
            src={g.src}
            alt={item.caption || "Samuel Bristow photograph"}
            width={g.w}
            height={g.h}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto" }}
            className="block"
          />
        ))}
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
        ) : null
      )}
    </section>
  );
}
