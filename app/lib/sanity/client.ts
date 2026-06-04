import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityEnabled = projectId.length > 0;

export const sanity: SanityClient | null = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-02-01",
      useCdn: false,
    })
  : null;

export function sized(url: string, w: number): string {
  if (!url) return url;
  if (/\.gif($|\?)/i.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${w}&auto=format&fit=max`;
}
