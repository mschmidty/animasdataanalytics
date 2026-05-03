// src/content.config.ts
import { defineCollection, z } from 'astro:content';
// 1. Import the glob loader
import { glob } from 'astro/loaders';

const work = defineCollection({
  // 2. Define the loader pointing to your markdown files
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/work" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    year: z.number(),
    tags: z.array(z.string()),
    featureImage: image(),
  }),
});

export const collections = { work };
