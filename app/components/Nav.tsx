"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Latest Series", href: "/" },
  { label: "Overview", href: "/overview" },
  { label: "Motion", href: "/motion" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/studio" },
];

const NAV_FONT: React.CSSProperties = {
  fontFamily: "var(--font-bodoni), serif",
  fontSize: "clamp(15px, 1.5vw, 18px)",
  letterSpacing: "0.01em",
  lineHeight: "1.6",
};

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="fixed z-40 top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-5 md:pt-7">
      <Link href="/" className="block">
        <Image
          src="/assets/logo.webp"
          alt="Samuel Bristow"
          width={613}
          height={269}
          className="w-[80px] md:w-[120px] h-auto"
          priority
        />
      </Link>

      <nav
        className="nav-full flex items-center justify-center flex-wrap mt-2 md:mt-3 text-[var(--brand-black)]"
        style={{ ...NAV_FONT, maxWidth: "320px", textAlign: "center" }}
      >
        {links.map((link, i) => (
          <span key={link.href} className="flex items-center">
            {i > 0 && (
              <span className="opacity-40 px-[4px] select-none">/</span>
            )}
            <Link
              href={link.href}
              className={`px-[3px] hover:opacity-60 transition-opacity duration-200${pathname === link.href ? " opacity-100" : ""}`}
            >
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
