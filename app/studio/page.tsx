import Image from "next/image";

const images = [
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
];

export default function Studio() {
  return (
    <main
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
            fontSize: "clamp(16px, 1.5vw, 19px)",
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
            <Image
              key={img.src}
              src={img.src}
              alt=""
              width={img.w}
              height={img.h}
              style={{ width: "100%", height: "auto" }}
              className="block"
              sizes="(max-width: 767px) 90vw, 45vw"
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
            Samuel Bristow Photography, Inc.
          </h2>

          <div
            className="mt-6 md:mt-8 flex flex-col gap-1 leading-relaxed"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "clamp(13px, 1.2vw, 15px)",
              letterSpacing: "0.02em",
            }}
          >
            <p className="m-0">Studio: 247 Water Street #305</p>
            <p className="m-0">Brooklyn, NY 11201</p>
            <p className="m-0 mt-4">
              <a
                href="tel:+19177214764"
                className="hover:opacity-60 transition-opacity duration-200"
              >
                (917) 721 4764
              </a>
            </p>
            <p className="m-0">
              <a
                href="mailto:info@samuelbristow.com"
                className="hover:opacity-60 transition-opacity duration-200"
              >
                info@samuelbristow.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
