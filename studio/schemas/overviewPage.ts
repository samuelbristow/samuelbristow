import { defineType, defineField } from "sanity";

export const overviewPage = defineType({
  name: "overviewPage",
  title: "Portfolio Overview",
  type: "document",
  fields: [
    defineField({
      name: "cells",
      title: "Images",
      type: "array",
      of: [{ type: "overviewCell" }],
      description:
        "Drag to reorder. Each cell is one image, or a small group of 2–3.",
    }),
  ],
  preview: { prepare: () => ({ title: "Portfolio Overview" }) },
});
