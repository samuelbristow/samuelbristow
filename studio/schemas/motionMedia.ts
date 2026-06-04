import { defineType, defineField } from "sanity";

export const motionMedia = defineType({
  name: "motionMedia",
  title: "Motion item",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "video",
      options: {
        list: [
          { title: "Video (mp4)", value: "video" },
          { title: "GIF / Image", value: "image" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "video",
      title: "Video (mp4)",
      type: "file",
      options: { accept: "video/mp4" },
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "image",
      title: "GIF / Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === "video",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "number",
      description: "Pixel width (required for video; helps layout proportions).",
    }),
    defineField({
      name: "height",
      title: "Height",
      type: "number",
    }),
  ],
  preview: {
    select: { media: "image", type: "type" },
    prepare({ media, type }) {
      return { title: type === "video" ? "Video" : "GIF / Image", media };
    },
  },
});
