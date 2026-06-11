"use client";

type NavLink = { label: string; href: string; external?: boolean };

const DEFAULT_INSTAGRAM = "https://www.instagram.com/samuelbristow.photo/";

const NAV_FONT: React.CSSProperties = {
  fontFamily: '"psfournier-std", serif',
  fontSize: "clamp(12px, 1.1vw, 13px)",
  fontWeight: 300,
  letterSpacing: "0.01em",
  lineHeight: "1.6",
};

export function Nav({ instagramUrl }: { instagramUrl?: string }) {
  const rows: NavLink[][] = [
    [
      { label: "Latest Series", href: "/#latest" },
      { label: "Portfolio Overview", href: "/#overview" },
      { label: "Motion", href: "/#motion" },
    ],
    [
      { label: "About", href: "/#about" },
      { label: "Studio", href: "/#studio" },
      { label: "Instagram", href: instagramUrl || DEFAULT_INSTAGRAM, external: true },
    ],
  ];

  const scrollToHash = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const id = href.slice(hashIndex + 1);
    const el = document.getElementById(id);
    if (!el) return; // section not on this page — let the browser navigate
    e.preventDefault();

    const startY = window.scrollY;
    const targetY = el.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = 1400;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let startTime: number | null = null;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    window.history.pushState(null, "", `#${id}`);
  };

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
    return (
      <a
        key={link.href}
        href={link.href}
        onClick={(e) => scrollToHash(e, link.href)}
        className="hover:opacity-60 transition-opacity duration-200"
      >
        {link.label}
      </a>
    );
  };

  return (
    <div className="nav-root fixed z-40 top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pt-5 md:pt-7">
      <a
        href="/#latest"
        onClick={(e) => scrollToHash(e, "/#latest")}
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
      </a>

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
