import { defineType, defineField } from "sanity";

export const overviewCell = defineType({
  name: "overviewCell",
  title: "Cell",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images (1–3)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Add one image for a normal tile, or 2–3 to group them tightly as one unit.",
      validation: (r) => r.min(1).max(3),
    }),
  ],
  preview: {
    select: { media: "images.0", images: "images" },
    prepare({ media, images }) {
      const n = Array.isArray(images) ? images.length : 0;
      return { title: n > 1 ? `Group of ${n}` : "Single image", media };
    },
  },
});
