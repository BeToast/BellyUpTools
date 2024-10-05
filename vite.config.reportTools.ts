import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
   plugins: [react()],
   root: "src/reportTools",
   build: {
      outDir: "../../dist/reportTools",
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
      port: 3001,
   },
   base: "/reportTools/",
   publicDir: "../../public",
});
