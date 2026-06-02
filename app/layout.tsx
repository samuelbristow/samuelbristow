import type { Metadata } from "next";
import { Bodoni_Moda, DM_Sans, Scheherazade_New } from "next/font/google";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Samuel Bristow",
  description: "Portfolio",
};

const scrollScript = `(function(){
  var lastY=0,hidden=false;
  function gy(){return window.visualViewport?window.visualViewport.pageTop:(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0);}
  function set(h){if(h===hidden)return;hidden=h;document.body.classList.toggle('is-scrolled',h);}
  function upd(){
    var y=gy();
    if(y<=40){set(false);}
    else if(y<lastY-2){set(false);}
    else if(y>lastY+2){set(true);}
    lastY=y;
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('touchmove',upd,{passive:true});
  window.addEventListener('touchend',upd,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('scroll',upd);
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${dmSans.variable} ${scheherazade.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
        <Nav />
        <div>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
