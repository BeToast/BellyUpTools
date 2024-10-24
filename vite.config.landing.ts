import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Generate timestamp for cache busting
const timestamp = new Date().getTime();
``;
export default defineConfig({
   plugins: [react()],
   root: "src/landing",
   build: {
      outDir: "../../dist/landing",
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
