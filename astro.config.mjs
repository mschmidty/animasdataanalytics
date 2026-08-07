// @ts-check
import { defineConfig } from "astro/config";
import path from "path";

// https://astro.build/config
export default defineConfig({
  vite: {
    optimizeDeps: {
      include: ["p5"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${path.resolve("src/styles/_main.scss")}" as *;`,
        },
      },
    },
  },
});
