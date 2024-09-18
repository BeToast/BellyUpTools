import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
   plugins: [react()],
   root: "src/landing",
   build: {
      outDir: "../../dist/landing",
      emptyOutDir: true,
      rollupOptions: {
         output: {
            entryFileNames: "assets/[name]-[hash].js",
            chunkFileNames: "assets/[name]-[hash].js",
            assetFileNames: "assets/[name]-[hash].[ext]",
         },
      },
   },
   server: {
      port: 3000,
   },
   base: "/landing/",
   publicDir: "../../public",
   resolve: {
      alias: {
         "@shared": path.resolve(__dirname, "../shared"),
      },
   },
});
