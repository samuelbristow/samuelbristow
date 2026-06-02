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
  fontSize: "clamp(11px, 1vw, 13px)",
  letterSpacing: "0.02em",
  lineHeight: "1.6",
};

export default function About() {
  return (
    <main
      className="about-page min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-[120px] md:pt-[150px] pb-[2em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      <div className="max-w-[720px] mx-auto">
        <div
          className="flex flex-col gap-3"
          style={{
            fontFamily: "var(--font-bodoni), serif",
            fontSize: "clamp(14px, 1.6vw, 20px)",
            lineHeight: "1.45",
            letterSpacing: "0.01em",
          }}
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="m-0">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>

        <div className="mt-[1.8em] flex flex-col gap-1" style={bodyStyle}>
          <p className="m-0">Represented by WiB New York Inc.</p>
          <p className="m-0">
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

        <div className="mt-[1.8em]" style={bodyStyle}>
          <p className="m-0 opacity-50">Select Clients</p>
          <ul className="mt-2 m-0 p-0 list-none columns-3 sm:columns-4 lg:columns-5 gap-x-7 text-left max-w-[680px] mx-auto">
            {clients.map((c) => (
              <li key={c} className="break-inside-avoid">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <p
          className="m-0 mt-[1.8em] opacity-40"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "clamp(10px, 1vw, 11px)",
            letterSpacing: "0.04em",
          }}
        >
          All images © Samuel Bristow Photography Inc
        </p>
      </div>
    </main>
  );
}
