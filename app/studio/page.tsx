import type { Metadata } from "next";
import { getStudio } from "../lib/sanity/queries";
import { sized } from "../lib/sanity/client";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Samuel Bristow's New York still life studio — approach, services and contact for product, beauty and fragrance commissions and collaborations.",
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "Studio — Samuel Bristow",
    description:
      "Samuel Bristow's New York still life studio — approach, services and contact for product, beauty and fragrance commissions and collaborations.",
    url: "/studio",
  },
};

const FALLBACK = {
  images: [
    {
      src: "/assets/images/studio/709880788_3047816125423303_3667000234594789305_n.jpg",
      w: 1228,
      h: 1566,
    },
    {
      src: "/assets/images/studio/709587190_1363283052355269_6670921504243095640_n.jpg",
      w: 1400,
      h: 933,
    },
  ],
  companyName: "Samuel Bristow Photography, Inc.",
  address: ["Studio: 247 Water Street #305", "Brooklyn, NY 11201"],
  phone: "(917) 721 4764",
  email: "info@samuelbristow.com",
};

export async function StudioSection({ id }: { id?: string }) {
  const data = await getStudio();

  const images =
    data?.images && data.images.length
      ? data.images.map((i) => ({ src: sized(i.src, 1200, 65), w: i.w, h: i.h }))
      : FALLBACK.images;
  const companyName = data?.companyName || FALLBACK.companyName;
  const address =
    data?.address && data.address.length ? data.address : FALLBACK.address;
  const phone = data?.phone || FALLBACK.phone;
  const email = data?.email || FALLBACK.email;
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section
      id={id}
      className="pt-[88px] md:pt-[130px] pb-[6em] md:pb-[10em]"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
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
          Studio
        </span>
      </div>

      <div className="px-6 md:px-10 lg:px-[120px] max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          {images.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt="Inside Samuel Bristow's New York still life studio"
              width={img.w}
              height={img.h}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "auto" }}
              className="block"
            />
          ))}
        </div>

        <div className="mt-[5em] md:mt-[8em] text-center">
          <h2
            style={{
              fontFamily: "var(--font-bodoni), serif",
              fontSize: "clamp(22px, 3vw, 34px)",
              letterSpacing: "0.01em",
              lineHeight: "1.3",
            }}
          >
            {companyName}
          </h2>

          <div
            className="mt-6 md:mt-8 flex flex-col gap-1 leading-relaxed"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              letterSpacing: "0.02em",
            }}
          >
            {address.map((line, i) => (
              <p key={i} className="m-0">
                {line}
              </p>
            ))}
            <p className="m-0 mt-4">
              <a
                href={telHref}
                className="hover:opacity-60 transition-opacity duration-200"
              >
                {phone}
              </a>
            </p>
            <p className="m-0">
              <a
                href={`mailto:${email}`}
                className="hover:opacity-60 transition-opacity duration-200"
              >
                {email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function StudioPage() {
  return (
    <main>
      <StudioSection />
    </main>
  );
}
