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

function MediaCard({ item, align }: { item: Item; align: string }) {
  const full = isFullWidth(item);
  return (
    <div data-item className="mb-[6em] md:mb-[12em] lg:mb-[15em]">
      <Link
        href={item.href}
        className={`group/card relative block mx-auto ${align}`}
        style={{ width: full ? "var(--item-w-full, 92%)" : "var(--item-w, 75%)" }}
      >
        {item.type === "video" ? (
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "auto" }}
            className="block"
          />
        ) : (
          <Image
            src={item.image}
            alt=""
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
      </Link>

      {item.caption ? (
        <div
          className="md:hidden mt-3 mx-auto"
          style={{ width: full ? "var(--item-w-full, 92%)" : "var(--item-w, 75%)" }}
        >
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
    <main
      ref={mainRef}
      className="pt-[120px] md:pt-[180px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <Preloader images={preloaderImages} />
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
    </main>
  );
}
