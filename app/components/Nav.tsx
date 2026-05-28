"use client";

import Link from "next/link";
import { useRef } from "react";
import { useMountEffect } from "../hooks/useMountEffect";

const links = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Motion", href: "/motion" },
  { label: "About", href: "/about" },
];

export function Nav() {
  const centerRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLAnchorElement>(null);

  useMountEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const setTransition = (on: boolean) => {
      const val = on ? "opacity 0.6s ease" : "none";
      if (centerRef.current) centerRef.current.style.transition = val;
      if (rightRef.current) rightRef.current.style.transition = val;
    };

    const setOpacity = (opacity: number) => {
      const str = String(opacity);
      const pointer = opacity === 0 ? "none" : "";
      if (centerRef.current) {
        centerRef.current.style.opacity = str;
        centerRef.current.style.pointerEvents = pointer;
      }
      if (rightRef.current) {
        rightRef.current.style.opacity = str;
        rightRef.current.style.pointerEvents = pointer;
      }
    };

    const onScroll = () => {
      setTransition(false);
      const opacity = Math.max(0, 1 - window.scrollY / 80);
      setOpacity(opacity);

      clearTimeout(idleTimer);
      if (window.scrollY > 0) {
        idleTimer = setTimeout(() => {
          setTransition(true);
          setOpacity(1);
        }, 10000);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
    };
  });

  return (
    <>
      <input
        type="checkbox"
        id="nav-menu"
        className="peer/menu sr-only"
        aria-hidden="true"
      />

      <header className="fixed z-40 inset-x-0 top-0 flex items-center justify-between px-5 md:px-10 lg:px-[72px] py-[10px] md:py-[30px]">
        <Link
          href="/"
          className="text-[12px] font-medium uppercase tracking-[0.2em] leading-[1.33] text-[var(--brand-black)]"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          Samuel Bristow
        </Link>

        <nav
          ref={centerRef}
          className="hidden md:flex items-center gap-[5px] text-[var(--brand-black)]"
          style={{
            fontFamily: "var(--font-lora), serif",
            fontSize: "20px",
            letterSpacing: "0.01em",
            lineHeight: "1.05",
          }}
        >
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center gap-[5px]">
              {i > 0 && <span className="select-none opacity-40">/</span>}
              <Link href={link.href} className="px-1 hover:opacity-60 transition-opacity duration-200">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        <a
          ref={rightRef}
          href="https://www.instagram.com/samuelbristow"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-[12px] font-medium uppercase tracking-[0.2em] leading-[1.33] text-[var(--brand-black)] hover:opacity-60 transition-opacity duration-200"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          Instagram
        </a>

        <label
          htmlFor="nav-menu"
          className="md:hidden flex flex-col justify-center items-center gap-[6px] w-11 h-11 -mr-2 cursor-pointer"
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-[var(--brand-black)]" />
          <span className="block w-5 h-px bg-[var(--brand-black)]" />
        </label>
      </header>

      <div className="fixed inset-0 z-50 bg-[var(--white-smoke)] flex-col px-5 py-[10px] hidden peer-checked/menu:flex md:peer-checked/menu:hidden">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-[12px] font-medium uppercase tracking-[0.2em] leading-[1.33] text-[var(--brand-black)]"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            Samuel Bristow
          </Link>
          <label
            htmlFor="nav-menu"
            className="flex items-center justify-end w-11 h-11 -mr-2 text-[12px] font-medium uppercase tracking-[0.2em] text-[var(--brand-black)] leading-[1.33] cursor-pointer"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            aria-label="Close menu"
          >
            Close
          </label>
        </div>

        <nav className="flex flex-col gap-6 mt-auto mb-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[42px] leading-none font-normal text-[var(--brand-black)]"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href="https://www.instagram.com/samuelbristow"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium uppercase tracking-[0.2em] leading-[1.33] text-[var(--brand-black)]"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          Instagram
        </a>
      </div>
    </>
  );
}
