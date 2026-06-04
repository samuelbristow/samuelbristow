import { sanity, sanityEnabled } from "./client";
import type { PortableTextBlock } from "@portabletext/react";

async function safeFetch<T>(query: string): Promise<T | null> {
  if (!sanityEnabled || !sanity) return null;
  try {
    return await sanity.fetch<T>(query);
  } catch (e) {
    console.warn(
      "[sanity] fetch failed, falling back to built-in content:",
      (e as Error).message
    );
    return null;
  }
}

export type Media = {
  type: "image" | "video";
  src: string;
  width: number;
  height: number;
  landscape?: boolean;
  link?: string;
  caption?: string;
};

type RawMedia = {
  type?: "image" | "video";
  landscape?: boolean;
  link?: string;
  caption?: string;
  imgUrl?: string;
  imgW?: number;
  imgH?: number;
  vidUrl?: string;
  vidW?: number;
  vidH?: number;
};

function normalize(d: RawMedia): Media | null {
  if (d.type === "video") {
    if (!d.vidUrl) return null;
    return {
      type: "video",
      src: d.vidUrl,
      width: d.vidW || 1276,
      height: d.vidH || 720,
      landscape: d.landscape ?? true,
      link: d.link,
      caption: d.caption,
    };
  }
  if (!d.imgUrl || !d.imgW || !d.imgH) return null;
  return {
    type: "image",
    src: d.imgUrl,
    width: d.imgW,
    height: d.imgH,
    landscape: d.landscape,
    link: d.link,
    caption: d.caption,
  };
}

const MEDIA_PROJECTION = `{
  "type": type,
  "landscape": landscape,
  "link": link,
  "caption": caption,
  "imgUrl": image.asset->url,
  "imgW": image.asset->metadata.dimensions.width,
  "imgH": image.asset->metadata.dimensions.height,
  "vidUrl": video.asset->url,
  "vidW": width,
  "vidH": height
}`;

export async function getHomeItems(): Promise<Media[] | null> {
  const raw = await safeFetch<RawMedia[] | null>(
    `*[_type=="homePage"][0].items[]${MEDIA_PROJECTION}`
  );
  if (!raw || raw.length === 0) return null;
  return raw.map(normalize).filter((m): m is Media => m !== null);
}

export async function getMotionItems(): Promise<Media[] | null> {
  const raw = await safeFetch<RawMedia[] | null>(
    `*[_type=="motionPage"][0].items[]${MEDIA_PROJECTION}`
  );
  if (!raw || raw.length === 0) return null;
  return raw.map(normalize).filter((m): m is Media => m !== null);
}

export type OverviewImg = { src: string; w: number; h: number };
export type OverviewCell = OverviewImg[];

export async function getOverviewCells(): Promise<OverviewCell[] | null> {
  const raw = await safeFetch<{ images: OverviewImg[] }[] | null>(
    `*[_type=="overviewPage"][0].cells[]{
      "images": images[]{
        "src": asset->url,
        "w": asset->metadata.dimensions.width,
        "h": asset->metadata.dimensions.height
      }
    }`
  );
  if (!raw || raw.length === 0) return null;
  return raw
    .map((c) => (c.images || []).filter((i) => i.src && i.w && i.h))
    .filter((c) => c.length > 0);
}

export type AboutData = {
  bio: PortableTextBlock[] | null;
  representation: string | null;
  phone: string | null;
  email: string | null;
  clients: string[] | null;
  copyright: string | null;
};

export async function getAbout(): Promise<AboutData | null> {
  return safeFetch<AboutData | null>(
    `*[_type=="aboutPage"][0]{ bio, representation, phone, email, clients, copyright }`
  );
}

export type StudioData = {
  images: { src: string; w: number; h: number }[] | null;
  companyName: string | null;
  address: string[] | null;
  phone: string | null;
  email: string | null;
};

export async function getStudio(): Promise<StudioData | null> {
  return safeFetch<StudioData | null>(
    `*[_type=="studioPage"][0]{
      "images": images[]{
        "src": asset->url,
        "w": asset->metadata.dimensions.width,
        "h": asset->metadata.dimensions.height
      },
      companyName, address, phone, email
    }`
  );
}

export async function getInstagramUrl(): Promise<string | null> {
  return safeFetch<string | null>(
    `*[_type=="siteSettings"][0].instagramUrl`
  );
}

export type PreImg = { src: string; w: number; h: number };

export async function getPreloaderImages(): Promise<PreImg[] | null> {
  const raw = await safeFetch<PreImg[] | null>(
    `*[_type=="siteSettings"][0].preloaderImages[]{
      "src": asset->url,
      "w": asset->metadata.dimensions.width,
      "h": asset->metadata.dimensions.height
    }`
  );
  if (!raw || raw.length === 0) return null;
  return raw.filter((i) => i.src && i.w && i.h);
}
