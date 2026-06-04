import { defineType, defineField } from "sanity";

export const studioPage = defineType({
  name: "studioPage",
  title: "Studio",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "companyName",
      title: "Company name",
      type: "string",
      initialValue: "Samuel Bristow Photography, Inc.",
    }),
    defineField({
      name: "address",
      title: "Address lines",
      type: "array",
      of: [{ type: "string" }],
      description: "One line per row, e.g. “Studio: 247 Water Street #305”.",
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Studio" }) },
});
