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
          title: "Image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Hover text",
              type: "string",
            },
          ],
          preview: {
            select: { media: "asset", caption: "caption" },
            prepare({ media, caption }) {
              return { title: caption || "Image", media };
            },
          },
        },
        { type: "overviewGroup" },
      ],
      description:
        "Drag in multiple images at once — each becomes its own tile. Use “Group” to tie 2–3 images into a single tile. Drag to reorder.",
    }),
  ],
  preview: { prepare: () => ({ title: "Portfolio Overview" }) },
});
