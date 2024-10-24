import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Generate timestamp for cache busting
const timestamp = new Date().getTime();

export default defineConfig({
   plugins: [react()],
   root: "src/reportTools",
   build: {
      outDir: "../../dist/reportTools",
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
      port: 3001,
   },
   base: "/reportTools/",
   publicDir: "../../public",
});
