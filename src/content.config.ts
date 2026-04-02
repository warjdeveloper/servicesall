import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const products = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/data/products" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        img: z.string(),
        price: z.number(),
    }),
});

export const collections = { products };