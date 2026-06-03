import type { Metadata } from "next";
import { Scheherazade_New } from "next/font/google";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import "./globals.css";

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
  var s=false;
  function gy(){return window.visualViewport?window.visualViewport.pageTop:(window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0);}
  function upd(){
    var y=gy();
    if(!s && y>40){s=true;document.body.classList.add('is-scrolled');}
    else if(s && y<10){s=false;document.body.classList.remove('is-scrolled');}
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('touchmove',upd,{passive:true});
  window.addEventListener('touchend',upd,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('scroll',upd);
})();`;

const preloaderScript = `setTimeout(function(){var p=document.getElementById('preloader');if(p){p.style.transition='opacity .5s ease';p.style.opacity='0';setTimeout(function(){if(p)p.style.display='none';},520);}document.body.style.overflow='';},5500);`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={scheherazade.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vdi6dle.css" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <Nav />
        <div>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
