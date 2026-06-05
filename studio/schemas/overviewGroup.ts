import { defineType, defineField } from "sanity";

export const overviewGroup = defineType({
  name: "overviewGroup",
  title: "Group (2–3 images)",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images (2–3)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "2–3 images shown tightly together as one tile.",
      validation: (r) => r.min(2).max(3),
    }),
    defineField({
      name: "caption",
      title: "Hover text",
      type: "string",
      description: "Shown over the group on hover. Leave blank for no label.",
    }),
  ],
  preview: {
    select: { media: "images.0", images: "images" },
    prepare({ media, images }) {
      const n = Array.isArray(images) ? images.length : 0;
      return { title: `Group of ${n}`, media };
    },
  },
});
