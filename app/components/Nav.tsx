"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Latest Series", href: "/" },
  { label: "Portfolio Overview", href: "/overview" },
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
    <div className="nav-root fixed z-40 top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-5 md:pt-7">
      <Link
        href="/"
        className="block text-[var(--fg)] leading-none text-center"
        style={{
          fontFamily: "var(--font-scheherazade), serif",
          fontSize: "clamp(28px, 4vw, 44px)",
          letterSpacing: "0.02em",
        }}
      >
        Samuel Bristow
      </Link>

      <nav
        className="nav-full flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-2 md:mt-3 text-[var(--fg)]"
        style={{ ...NAV_FONT, maxWidth: "360px", textAlign: "center" }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:opacity-60 transition-opacity duration-200${pathname === link.href ? " opacity-100" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
