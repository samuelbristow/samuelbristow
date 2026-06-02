"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

let played = false;

type Media = { type: "image" | "video"; src: string };

const rows: Media[][] = [
  [
    { type: "image", src: "/assets/images/chanel/1.jpg" },
    { type: "image", src: "/assets/images/tekinoktay-day/1.jpg" },
    { type: "video", src: "/assets/hero.mp4" },
    { type: "image", src: "/assets/images/CK+Eternity+intro+1.jpg.webp" },
    { type: "image", src: "/assets/images/calderalab/1.jpg" },
    { type: "image", src: "/assets/images/Eucalyptusrain5-ezgif.com-video-to-gif-converter.gif" },
    { type: "image", src: "/assets/images/chanel/2.jpg" },
    { type: "image", src: "/assets/images/ezgif-3-b506754c48.gif" },
  ],
];

function Tile({ m }: { m: Media }) {
  const style: React.CSSProperties = {
    height: "32vh",
    width: "auto",
    objectFit: "cover",
    display: "block",
    flexShrink: 0,
  };
  if (m.type === "video") {
    return <video src={m.src} autoPlay muted loop playsInline style={style} />;
  }
  return <img src={m.src} alt="" decoding="async" style={style} />;
}

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (played) {
        setDone(true);
        return;
      }

      const root = rootRef.current!;
      const name = nameRef.current!;
      const rowEls = gsap.utils.toArray<HTMLElement>("[data-prow]");
      const logo = document.getElementById("brand-logo");

      document.body.style.overflow = "hidden";

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        played = true;
        document.body.style.overflow = "";
        setDone(true);
      };

      const fallback = window.setTimeout(finish, 3600);

      const settle = () => {
        try {
          if (!logo) throw new Error();
          const l = logo.getBoundingClientRect();
          const n = name.getBoundingClientRect();
          return {
            x: l.left + l.width / 2 - (n.left + n.width / 2),
            y: l.top + l.height / 2 - (n.top + n.height / 2),
            scale: l.height / n.height,
          };
        } catch {
          return { x: 0, y: -window.innerHeight * 0.42, scale: 0.3 };
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finish,
      });

      const W = window.innerWidth;

      gsap.set(name, { opacity: 0, scale: 1.06 });

      tl.to(name, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0);
      rowEls.forEach((row) => {
        tl.fromTo(
          row,
          { x: -W * 0.28 },
          { x: W * 0.28, duration: 2.6, ease: "power1.inOut" },
          0
        );
      });
      tl.add(() => {
        const s = settle();
        gsap.to(name, {
          x: s.x,
          y: s.y,
          scale: s.scale,
          duration: 1.1,
          ease: "power3.inOut",
        });
      }, 1.5)
        .to(rowEls, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 1.9)
        .to(root, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 2.4);

      return () => window.clearTimeout(fallback);
    },
    { scope: rootRef }
  );

  if (done) return null;

  return (
    <div
      ref={rootRef}
      id="preloader"
      className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "var(--white-smoke)" }}
    >
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-[3vh]" style={{ opacity: 0.5 }}>
        {rows.map((row, i) => (
          <div
            key={i}
            data-prow
            className="flex gap-[2vw] w-max max-w-none"
            style={{ willChange: "transform" }}
          >
            {row.map((m, j) => (
              <Tile key={j} m={m} />
            ))}
          </div>
        ))}
      </div>

      <div
        ref={nameRef}
        className="relative z-10 text-center leading-none text-[var(--brand-black)] whitespace-nowrap"
        style={{
          fontFamily: "var(--font-bodoni), serif",
          fontSize: "clamp(30px, 11vw, 200px)",
          letterSpacing: "0.005em",
          willChange: "transform",
        }}
      >
        Samuel Bristow
      </div>
    </div>
  );
}
