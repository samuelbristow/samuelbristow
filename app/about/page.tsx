import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getAbout } from "../lib/sanity/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "Samuel Bristow is a still life photographer and director based in New York City, transforming the everyday into the extraordinary through thoughtful composition and detail.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Samuel Bristow",
    description:
      "Samuel Bristow is a still life photographer and director based in New York City, transforming the everyday into the extraordinary through thoughtful composition and detail.",
    url: "/about",
  },
};

const FALLBACK_CLIENTS = [
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

const FALLBACK = {
  representation: "Represented by WiB New York Inc.",
  phone: "+1 310 717 6796",
  email: "ash@wibagency.com",
  copyright: "All images © Samuel Bristow Photography Inc",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), sans-serif",
  fontSize: "clamp(11px, 1vw, 13px)",
  letterSpacing: "0.02em",
  lineHeight: "1.6",
};

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="m-0">{children}</p>,
  },
};

export async function AboutSection({
  id,
  standalone = false,
}: {
  id?: string;
  standalone?: boolean;
}) {
  const data = await getAbout();

  const representation = data?.representation || FALLBACK.representation;
  const phone = data?.phone || FALLBACK.phone;
  const email = data?.email || FALLBACK.email;
  const copyright = data?.copyright || FALLBACK.copyright;
  const clients =
    data?.clients && data.clients.length ? data.clients : FALLBACK_CLIENTS;
  const bio = data?.bio && data.bio.length ? data.bio : null;

  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section
      id={id}
      className={
        standalone
          ? "about-page min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-[120px] md:pt-[150px] pb-[2em]"
          : "min-h-[100svh] flex flex-col text-center px-6 pb-[2em]"
      }
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      {!standalone && (
        <div
          className="section-name sticky z-20 text-center pb-[1em] md:pb-[2em]"
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
            About
          </span>
        </div>
      )}

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
          {bio ? (
            <PortableText value={bio} components={ptComponents} />
          ) : (
            <>
              <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="m-0">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
            </>
          )}
        </div>

        <div className="mt-[1.8em] flex flex-col gap-1" style={bodyStyle}>
          <p className="m-0">{representation}</p>
          <p className="m-0">
            C:{" "}
            <a
              href={telHref}
              className="hover:opacity-60 transition-opacity duration-200"
            >
              {phone}
            </a>
            {"    "}E:{" "}
            <a
              href={`mailto:${email}`}
              className="hover:opacity-60 transition-opacity duration-200"
            >
              {email}
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
          {copyright}
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main>
      <AboutSection standalone />
    </main>
  );
}
