export type Media = { kind: "video" | "gif"; src: string; w: number; h: number; ar: number; caption?: string; poster?: string };
export type Cell = { type: "single"; ar: number; item: Media };
export type Row = { cells: Cell[]; ar: number };

export const desktopRows: Row[] = [
  { ar: 6.0998, cells: [
    { type: "single", ar: 1.7722, item: { kind: "video", src: "/assets/hero.mp4", w: 1276, h: 720, ar: 1.7722 } },
    { type: "single", ar: 0.7503, item: { kind: "gif", src: "/assets/Elixir3.gif", w: 700, h: 933, ar: 0.7503 } },
    { type: "single", ar: 1.0, item: { kind: "gif", src: "/assets/Skincudicals-2.gif", w: 750, h: 750, ar: 1.0 } },
    { type: "single", ar: 1.7773, item: { kind: "gif", src: "/assets/Honey-Prospecting-GIF.gif", w: 750, h: 422, ar: 1.7773 } },
    { type: "single", ar: 0.8, item: { kind: "gif", src: "/assets/SPF---GIFF---09---cream.gif", w: 560, h: 700, ar: 0.8 } },
  ] },
  { ar: 6.152, cells: [
    { type: "single", ar: 1.0, item: { kind: "gif", src: "/assets/Naturopathica-sensetive.gif", w: 500, h: 500, ar: 1.0 } },
    { type: "single", ar: 1.7751, item: { kind: "gif", src: "/assets/Calendula-600px.gif", w: 600, h: 338, ar: 1.7751 } },
    { type: "single", ar: 0.7996, item: { kind: "gif", src: "/assets/SPF---GIFF---16---lotion.gif", w: 750, h: 938, ar: 0.7996 } },
    { type: "single", ar: 1.7773, item: { kind: "gif", src: "/assets/images/ezgif-3-b506754c48.gif", w: 750, h: 422, ar: 1.7773 } },
    { type: "single", ar: 0.8, item: { kind: "gif", src: "/assets/images/Eucalyptusrain5-ezgif.com-video-to-gif-converter.gif", w: 400, h: 500, ar: 0.8 } },
  ] },
];

export const mobileRows: Row[] = [
  { ar: 2.5225, cells: [
    { type: "single", ar: 1.7722, item: { kind: "video", src: "/assets/hero.mp4", w: 1276, h: 720, ar: 1.7722 } },
    { type: "single", ar: 0.7503, item: { kind: "gif", src: "/assets/Elixir3.gif", w: 700, h: 933, ar: 0.7503 } },
  ] },
  { ar: 2.7773, cells: [
    { type: "single", ar: 1.0, item: { kind: "gif", src: "/assets/Skincudicals-2.gif", w: 750, h: 750, ar: 1.0 } },
    { type: "single", ar: 1.7773, item: { kind: "gif", src: "/assets/Honey-Prospecting-GIF.gif", w: 750, h: 422, ar: 1.7773 } },
  ] },
  { ar: 1.8, cells: [
    { type: "single", ar: 0.8, item: { kind: "gif", src: "/assets/SPF---GIFF---09---cream.gif", w: 560, h: 700, ar: 0.8 } },
    { type: "single", ar: 1.0, item: { kind: "gif", src: "/assets/Naturopathica-sensetive.gif", w: 500, h: 500, ar: 1.0 } },
  ] },
  { ar: 2.5747, cells: [
    { type: "single", ar: 1.7751, item: { kind: "gif", src: "/assets/Calendula-600px.gif", w: 600, h: 338, ar: 1.7751 } },
    { type: "single", ar: 0.7996, item: { kind: "gif", src: "/assets/SPF---GIFF---16---lotion.gif", w: 750, h: 938, ar: 0.7996 } },
  ] },
  { ar: 2.5773, cells: [
    { type: "single", ar: 1.7773, item: { kind: "gif", src: "/assets/images/ezgif-3-b506754c48.gif", w: 750, h: 422, ar: 1.7773 } },
    { type: "single", ar: 0.8, item: { kind: "gif", src: "/assets/images/Eucalyptusrain5-ezgif.com-video-to-gif-converter.gif", w: 400, h: 500, ar: 0.8 } },
  ] },
];

