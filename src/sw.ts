/// <reference lib="webworker" />

import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

// Precache todos os assets estáticos
precacheAndRoute(self.__WB_MANIFEST);

// Cache para fontes do Google
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
      }),
    ],
  })
);

// Cache para chamadas da API
registerRoute(
  /^https:\/\/api\.seu-backend\.com\/.*/i,
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 24 horas
      }),
    ],
  })
);

// Evento de instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache inicial de assets
      caches.open("static-cache").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/manifest.json",
          // Adicione outros recursos estáticos importantes
        ]);
      }),
    ])
  );
});

// Evento de ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== "static-cache" && cacheName !== "api-cache") {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});
