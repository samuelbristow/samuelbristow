"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { label: string; href: string; external?: boolean };

const rows: NavLink[][] = [
  [
    { label: "Latest Series", href: "/" },
    { label: "Portfolio Overview", href: "/overview" },
    { label: "Motion", href: "/motion" },
  ],
  [
    { label: "About", href: "/about" },
    { label: "Studio", href: "/studio" },
    { label: "Instagram", href: "https://www.instagram.com/samuelbristow.photo/", external: true },
  ],
];

const NAV_FONT: React.CSSProperties = {
  fontFamily: '"psfournier-std", serif',
  fontSize: "clamp(12px, 1.1vw, 13px)",
  fontWeight: 300,
  letterSpacing: "0.01em",
  lineHeight: "1.6",
};

export function Nav() {
  const pathname = usePathname();

  const renderLink = (link: NavLink) => {
    if (link.external) {
      return (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity duration-200"
        >
          {link.label}
        </a>
      );
    }
    const active = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`hover:opacity-60 transition-opacity duration-200${active ? " opacity-100" : ""}`}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <div className="nav-root fixed z-40 top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-5 md:pt-7">
      <Link
        href="/"
        id="brand-logo"
        aria-label="Samuel Bristow"
        className="block text-[var(--fg)] leading-none text-center whitespace-nowrap"
        style={{
          fontFamily: '"psfournier-std", serif',
          fontWeight: 300,
          fontSize: "clamp(24px, 4vw, 46px)",
          letterSpacing: "0.15em",
          paddingLeft: "0.15em",
        }}
      >
        Samuel<span style={{ marginLeft: "0.15em" }}>Bristow</span>
      </Link>

      <nav
        className="nav-full flex flex-col items-center gap-y-1 mt-2 md:mt-3 text-[var(--fg)]"
        style={NAV_FONT}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-x-4 whitespace-nowrap"
          >
            {row.map(renderLink)}
          </div>
        ))}
      </nav>
    </div>
  );
}
