import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:5168",
      "/products": "http://localhost:5168",
      "/product-categories": "http://localhost:5168",
      "/orders": "http://localhost:5168",
      "/vendors": "http://localhost:5168",
      "/api": "http://localhost:5168",
    },
  },
});
