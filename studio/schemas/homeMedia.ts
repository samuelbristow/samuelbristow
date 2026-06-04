import { defineType, defineField } from "sanity";

export const homeMedia = defineType({
  name: "homeMedia",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "image",
      options: {
        list: [
          { title: "Image / GIF", value: "image" },
          { title: "Video (mp4)", value: "video" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "image",
      title: "Image / GIF",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === "video",
    }),
    defineField({
      name: "video",
      title: "Video (mp4)",
      type: "file",
      options: { accept: "video/mp4" },
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "width",
      title: "Width (video only)",
      type: "number",
      description: "Pixel width of the video, used for layout proportions.",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "height",
      title: "Height (video only)",
      type: "number",
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({
      name: "landscape",
      title: "Full width",
      type: "boolean",
      initialValue: false,
      description:
        "Turn on for wide / landscape media so it spans the full column width.",
    }),
    defineField({
      name: "link",
      title: "Link (optional)",
      type: "url",
      validation: (r) =>
        r.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { media: "image", type: "type" },
    prepare({ media, type }) {
      return { title: type === "video" ? "Video" : "Image", media };
    },
  },
});
