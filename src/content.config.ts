import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const products = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/data/products" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        media: z.object({
            imgs: z.array(
                z.object({
                    src: z.string(),
                    alt: z.string(),
                })
            ).min(1).max(6),
            video: z.object({
                src: z.string(),
                type: z.string(),
            }).optional(),
        }),
    }),
});

export const collections = { products };