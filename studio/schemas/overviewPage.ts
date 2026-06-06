import { defineType, defineField } from "sanity";

export const overviewPage = defineType({
  name: "overviewPage",
  title: "Portfolio Overview",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Hover text",
              type: "string",
              description: "Shown over the tile on hover. Leave blank for none.",
            },
            {
              name: "groupWithPrevious",
              title: "Group with previous",
              type: "boolean",
              description:
                "Tie this image to the one before it as a single tile (for a 2–3 image diptych/triptych).",
            },
          ],
          preview: {
            select: {
              media: "asset",
              caption: "caption",
              grouped: "groupWithPrevious",
            },
            prepare({ media, caption, grouped }) {
              return {
                title: caption || "Image",
                subtitle: grouped ? "↳ grouped with previous" : undefined,
                media,
              };
            },
          },
        },
      ],
      options: { layout: "grid" },
      description:
        "Drag in multiple images at once — each becomes its own tile. To make a diptych/triptych, turn on “Group with previous” on the 2nd (and 3rd) image.",
    }),
  ],
  preview: { prepare: () => ({ title: "Portfolio Overview" }) },
});
