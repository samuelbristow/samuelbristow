import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      initialValue: "https://www.instagram.com/samuelbristow.photo/",
    }),
    defineField({
      name: "preloaderImages",
      title: "Preloader images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Images shown in the intro/loading animation. Around 6–8 works best; portrait images pair up, wide ones show on their own.",
    }),
  ],
  preview: { prepare: () => ({ title: "Settings" }) },
});
