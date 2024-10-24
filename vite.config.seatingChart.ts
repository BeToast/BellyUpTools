import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Generate timestamp for cache busting
const timestamp = new Date().getTime();

export default defineConfig({
   plugins: [react()],
   root: "src/seatingChart",
   build: {
      outDir: "../../dist/seatingChart",
      emptyOutDir: true,
      rollupOptions: {
         output: {
            // Add timestamp to the hash
            entryFileNames: `assets/[name]-[hash]-${timestamp}.js`,
            chunkFileNames: `assets/[name]-[hash]-${timestamp}.js`,
            assetFileNames: `assets/[name]-[hash]-${timestamp}.[ext]`,
         },
      },
   },
   server: {
      port: 3002,
   },
   base: "/seatingChart/",
   publicDir: "../../public",
});
