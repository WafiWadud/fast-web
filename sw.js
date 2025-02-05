// Establish a cache name
const cacheName = "MyFancyCacheName_v1";

// Cache duration in milliseconds (2 days)
const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000;

// Helper function to check if a cached response is older than 2 days
const isCacheValid = (cachedResponse) => {
  if (!cachedResponse) return false;

  const cachedTime = new Date(cachedResponse.headers.get("date")).getTime();
  const now = new Date().getTime();

  return now - cachedTime < CACHE_DURATION;
};

// Helper function to clean expired entries
const cleanExpiredCaches = async (cache) => {
  const keys = await cache.keys();
  const deletionPromises = keys.map(async (request) => {
    const response = await cache.match(request);
    if (!isCacheValid(response)) {
      await cache.delete(request);
    }
  });
  await Promise.all(deletionPromises);
};

// Install event
self.addEventListener("install", (_event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== cacheName)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => caches.open(cacheName))
      .then(cleanExpiredCaches),
  );
});

// Fetch event with cache-first strategy and expiration
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  // Handle cross-origin requests
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === location.origin;

  // Only cache same-origin requests and specific API endpoints
  if (!isSameOrigin && !url.href.includes("jsonplaceholder.typicode.com")) {
    return;
  }

  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      // Check if we have a valid cached response
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse && isCacheValid(cachedResponse)) {
        return cachedResponse;
      }

      // If cache is invalid or missing, fetch from network
      try {
        const networkResponse = await fetch(event.request);

        if (networkResponse.ok) {
          // Create new headers preserving original headers
          const newHeaders = new Headers(networkResponse.headers);
          if (!newHeaders.has("date")) {
            newHeaders.set("date", new Date().toUTCString());
          }

          // Create a new Response with current date for cache timing
          const responseToCache = new Response(networkResponse.clone().body, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers: newHeaders,
          });

          // Store in cache
          await cache.put(event.request, responseToCache);
        }

        // Periodically clean expired entries
        if (Math.random() < 0.01) {
          cleanExpiredCaches(cache);
        }

        return networkResponse;
      } catch (error) {
        console.error("Fetch failed:", error);
        // If network fails and we have a cached response, return it even if expired
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      }
    }),
  );
});
