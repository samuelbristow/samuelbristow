import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { SmoothScroll } from "./providers/SmoothScroll";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Samuel Bristow",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable}`}>
      <body>
        <SmoothScroll>
          <Nav />
          <div className="pt-[80px]">
            {children}
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
