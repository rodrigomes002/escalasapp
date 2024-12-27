import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Escalas",
        short_name: "Escalas",
        description: "Escalas para ministerios de louvor",
        theme_color: "#ffffff",
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: /./, // Padrão que intercepta todas as requisições
            handler: "NetworkOnly", // Não usa cache, sempre busca pela rede
          },
        ],
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
