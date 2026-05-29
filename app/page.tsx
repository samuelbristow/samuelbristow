"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Item =
  | { type: "image"; id: string; href: string; image: string; width: number; height: number; landscape?: boolean }
  | { type: "gif"; id: string; href: string; image: string; width: number; height: number; landscape?: boolean }
  | { type: "video"; id: string; href: string; src: string };

const items: Item[] = [
  { type: "video",  id: "hero",        href: "/projects/calderalab",    src: "/assets/hero.mp4" },
  { type: "image",  id: "ch-1",        href: "/projects/chanel",        image: "/assets/images/chanel/1.jpg",                                          width: 750,  height: 1000 },
  { type: "gif",    id: "gif-1",       href: "/projects/eucalyptus",    image: "/assets/images/Eucalyptusrain5-ezgif.com-video-to-gif-converter.gif",   width: 400,  height: 500 },
  { type: "image",  id: "prada-1",     href: "/projects/prada",         image: "/assets/images/Prada+green+intro.jpg.webp",                            width: 2200, height: 1467, landscape: true },
  { type: "image",  id: "tk-1",        href: "/projects/tekinoktay-day",image: "/assets/images/tekinoktay-day/1.jpg",                                  width: 750,  height: 1000 },
  { type: "image",  id: "cl-1",        href: "/projects/calderalab",    image: "/assets/images/calderalab/1.jpg",                                      width: 750,  height: 1000 },
  { type: "image",  id: "ck-1",        href: "/projects/ck-eternity",   image: "/assets/images/CK+Eternity+intro+1.jpg.webp",                          width: 1800, height: 1200, landscape: true },
  { type: "image",  id: "ch-2",        href: "/projects/chanel",        image: "/assets/images/chanel/2.jpg",                                          width: 750,  height: 1000 },
  { type: "image",  id: "tk-2",        href: "/projects/tekinoktay-day",image: "/assets/images/tekinoktay-day/2.jpg",                                  width: 2500, height: 3333 },
  { type: "image",  id: "cl-2",        href: "/projects/calderalab",    image: "/assets/images/calderalab/2.jpg",                                      width: 750,  height: 1000 },
  { type: "image",  id: "christina-1", href: "/projects/christina",     image: "/assets/images/Christina+test_intro.jpg.webp",                         width: 2200, height: 1467, landscape: true },
  { type: "image",  id: "ch-3",        href: "/projects/chanel",        image: "/assets/images/chanel/3.jpg",                                          width: 750,  height: 1000 },
  { type: "gif",    id: "gif-2",       href: "/projects/campaign",      image: "/assets/images/ezgif-3-b506754c48.gif",                                width: 750,  height: 422,  landscape: true },
  { type: "image",  id: "tk-3",        href: "/projects/tekinoktay-day",image: "/assets/images/tekinoktay-day/3.jpg",                                  width: 2500, height: 3333 },
  { type: "image",  id: "cl-3",        href: "/projects/calderalab",    image: "/assets/images/calderalab/3.jpg",                                      width: 750,  height: 1000 },
  { type: "image",  id: "ch-4",        href: "/projects/chanel",        image: "/assets/images/chanel/4.jpg",                                          width: 750,  height: 1000 },
  { type: "image",  id: "tk-4",        href: "/projects/tekinoktay-day",image: "/assets/images/tekinoktay-day/4.jpg",                                  width: 2500, height: 3333 },
  { type: "image",  id: "cl-4",        href: "/projects/calderalab",    image: "/assets/images/calderalab/4.jpg",                                      width: 500,  height: 666 },
  { type: "image",  id: "tk-5",        href: "/projects/tekinoktay-day",image: "/assets/images/tekinoktay-day/5.jpg",                                  width: 1500, height: 2000 },
  { type: "image",  id: "cl-5",        href: "/projects/calderalab",    image: "/assets/images/calderalab/5.jpg",                                      width: 750,  height: 1000 },
  { type: "image",  id: "tk-6",        href: "/projects/tekinoktay-day",image: "/assets/images/tekinoktay-day/6.jpg",                                  width: 1500, height: 2000 },
];

const isFullWidth = (item: Item) =>
  item.type === "video" ||
  ((item.type === "image" || item.type === "gif") && item.landscape);

export default function Home() {
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
          Latest Series
        </span>
      </div>

      <div className="columns-1 md:columns-2 gap-[8em] px-10 md:px-16 lg:px-[120px]">
        {items.map((item) => (
          <div key={item.id} data-item className="mb-[4em] md:mb-[10em] break-inside-avoid">
            <Link href={item.href} className="block group/card">
              <div
                className="mx-auto relative"
                style={{ width: isFullWidth(item) ? "var(--item-w-full, 92%)" : "var(--item-w, 75%)" }}
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
                    sizes="(max-width: 767px) 85vw, 45vw"
                  />
                )}

                <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 pointer-events-none">
                  <span
                    className="text-[var(--brand-black)]"
                    style={{
                      fontFamily: "var(--font-bodoni), serif",
                      fontSize: "clamp(20px, 2vw, 26px)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Client
                  </span>
                </div>
              </div>

              <div className="md:hidden mt-3 text-center">
                <span
                  className="text-[var(--brand-black)]"
                  style={{
                    fontFamily: "var(--font-bodoni), serif",
                    fontSize: "16px",
                    letterSpacing: "0.01em",
                  }}
                >
                  Client
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
