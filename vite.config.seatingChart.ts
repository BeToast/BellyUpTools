import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
   plugins: [react()],
   root: "src/seatingChart",
   build: {
      outDir: "../../dist/seatingChart",
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
      port: 3002,
   },
   base: "/seatingChart/",
   publicDir: "../../public",
   resolve: {
      alias: {
         "@shared": path.resolve(__dirname, "../shared"),
      },
   },
});
