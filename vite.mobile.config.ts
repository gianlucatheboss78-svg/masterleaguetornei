import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Separate from the Start/SSR configuration: only browser code is packaged.
export default defineConfig({
  root: fileURLToPath(new URL("./mobile", import.meta.url)),
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  envDir: fileURLToPath(new URL(".", import.meta.url)),
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  build: {
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: true,
  },
});