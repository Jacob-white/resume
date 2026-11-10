self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.clients.claim();
        const keys = await self.caches.keys();
        await Promise.all(keys.map((k) => self.caches.delete(k)));
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        await self.registration.unregister();
        for (const client of clients) {
          const url = new URL(client.url);
          if (url.pathname === "/" || url.pathname === "/resume" || url.pathname === "/resume/") {
            await client.navigate("/");
          }
        }
      } catch (_) {}
    })()
  );
});
