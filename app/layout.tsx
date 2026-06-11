import type { Metadata, Viewport } from "next";
import { Scheherazade_New } from "next/font/google";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { getInstagramUrl } from "./lib/sanity/queries";
import "./globals.css";

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://www.samuelbristow.com";
const SITE_NAME = "Samuel Bristow";
const DESCRIPTION =
  "Still life photographer and director based in New York City. Through thoughtful composition and a keen eye for detail, Samuel Bristow transforms the everyday into the extraordinary.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Samuel Bristow — Still Life Photographer & Director, NYC",
    template: "%s — Samuel Bristow",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Samuel Bristow", url: SITE_URL }],
  creator: "Samuel Bristow",
  keywords: [
    "Samuel Bristow",
    "still life photographer",
    "still life photography",
    "product photographer",
    "New York photographer",
    "NYC still life",
    "director",
    "beauty photography",
    "fragrance photography",
    "editorial photography",
  ],
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Samuel Bristow — Still Life Photographer & Director, NYC",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Samuel Bristow — Still Life Photographer & Director" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samuel Bristow — Still Life Photographer & Director, NYC",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Samuel Bristow",
      jobTitle: "Still Life Photographer & Director",
      url: SITE_URL,
      image: `${SITE_URL}/og.png`,
      description: DESCRIPTION,
      email: "info@samuelbristow.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "New York",
        addressRegion: "NY",
        addressCountry: "US",
      },
      sameAs: ["https://www.instagram.com/samuelbristow.photo/"],
      knowsAbout: [
        "Still life photography",
        "Product photography",
        "Beauty photography",
        "Fragrance photography",
        "Art direction",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
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

const lazyVideoScript = `(function(){
  function setup(){
    var vids=document.querySelectorAll('video[data-grid-video]');
    if(!('IntersectionObserver' in window)){for(var i=0;i<vids.length;i++){var p=vids[i].play();if(p&&p.catch)p.catch(function(){});}return;}
    var io=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        var v=entries[i].target;
        if(entries[i].isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}
        else{v.pause();}
      }
    },{rootMargin:'300px 0px'});
    for(var i=0;i<vids.length;i++){io.observe(vids[i]);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);
  else setup();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const instagramUrl = (await getInstagramUrl()) || undefined;
  return (
    <html lang="en" className={scheherazade.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vdi6dle.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <script dangerouslySetInnerHTML={{ __html: lazyVideoScript }} />
        <Nav instagramUrl={instagramUrl} />
        <div>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
