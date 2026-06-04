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
          { title: "Video", value: "video" },
          { title: "GIF / Image", value: "image" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
      description:
        "mp4, mov, webm, etc. For best playback across browsers use mp4 (H.264) or webm.",
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
    defineField({
      name: "caption",
      title: "Hover text",
      type: "string",
      description: "Shown over the item on hover. Leave blank for no label.",
    }),
  ],
  preview: {
    select: { media: "image", type: "type" },
    prepare({ media, type }) {
      return { title: type === "video" ? "Video" : "GIF / Image", media };
    },
  },
});
