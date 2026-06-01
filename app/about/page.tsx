const clients = [
  "Calvin Klein",
  "Caldera + Lab",
  "Cann",
  "Chantecaille",
  "David Yurman",
  "Ebay",
  "e.l.f.",
  "Estēe Lauder",
  "fig.1",
  "Guess",
  "Kiehl’s",
  "La Mer",
  "LANA",
  "L’Occitane en Provence",
  "Merit",
  "Moroccanoil",
  "NARS",
  "Naturopathica",
  "NuFace",
  "Origins",
  "New York Times Style",
  "Shiseido",
  "Skincueticals",
  "Soft Services",
  "Savannah Friedkin",
  "Uniqlo",
  "Verb",
];

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: "clamp(13px, 1.2vw, 15px)",
  letterSpacing: "0.02em",
  lineHeight: "1.8",
};

export default function About() {
  return (
    <main
      data-theme="dark"
      className="pt-[88px] md:pt-[130px] pb-[6em] md:pb-[10em] min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      <div
        className="section-name sticky z-20 text-center pb-[1em] md:pb-[2em]"
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
          About
        </span>
      </div>

      <div className="px-6 max-w-[820px] mx-auto text-center">
        <div
          className="flex flex-col gap-6"
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontSize: "clamp(20px, 2.4vw, 30px)",
            lineHeight: "1.55",
            letterSpacing: "0.01em",
          }}
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="m-0">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
            non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </p>
        </div>

        <div className="mt-[6em] md:mt-[8em] flex flex-col gap-2" style={bodyStyle}>
          <p className="m-0">Represented by WiB New York Inc.</p>
          <p className="m-0 mt-2">
            C:{" "}
            <a
              href="tel:+13107176796"
              className="hover:opacity-60 transition-opacity duration-200"
            >
              +1 310 717 6796
            </a>
            {"    "}E:{" "}
            <a
              href="mailto:ash@wibagency.com"
              className="hover:opacity-60 transition-opacity duration-200"
            >
              ash@wibagency.com
            </a>
          </p>
        </div>

        <div className="mt-[6em] md:mt-[8em]" style={bodyStyle}>
          <p className="m-0">Select Clients</p>
          <p className="m-0 mt-4 opacity-70">{clients.join(",  ")}</p>
        </div>

        <p
          className="m-0 mt-[6em] md:mt-[8em] opacity-40"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "clamp(11px, 1vw, 12px)",
            letterSpacing: "0.04em",
          }}
        >
          All images © Samuel Bristow Photography Inc
        </p>
      </div>
    </main>
  );
}
