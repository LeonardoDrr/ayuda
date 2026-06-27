// ============================================================
// Service Worker — Venezuela Emergency Portal
// Estrategia: Cache-First para activos estáticos.
// Garantiza acceso sin conexión a guías y números de emergencia.
// ============================================================

const CACHE_NAME = "ve-emergencia-v2";
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/styles.css",
    "/app.js",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
];

// Instalación: pre-cachear todos los activos esenciales
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cachear activos locales (ignorar errores en fuentes externas)
            return cache.addAll(["/", "/index.html", "/styles.css", "/app.js"]);
        })
    );
    self.skipWaiting();
});

// Activación: limpiar cachés antiguas
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch: Cache-First con fallback a red
self.addEventListener("fetch", (event) => {
    // Solo interceptar peticiones GET
    if (event.request.method !== "GET") return;

    // No interceptar Firebase ni Cloudinary (requieren red siempre)
    const url = event.request.url;
    if (
        url.includes("firebaseio.com") ||
        url.includes("googleapis.com/identitytoolkit") ||
        url.includes("cloudinary.com")
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request)
                .then((response) => {
                    // Solo cachear respuestas válidas de activos propios
                    if (
                        response.ok &&
                        (url.includes(self.location.origin) ||
                            url.includes("fonts.googleapis.com") ||
                            url.includes("fonts.gstatic.com") ||
                            url.includes("gstatic.com/firebasejs"))
                    ) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) =>
                            cache.put(event.request, clone)
                        );
                    }
                    return response;
                })
                .catch(() => {
                    // Sin red y sin caché: devolver index.html (SPA fallback)
                    if (event.request.headers.get("accept")?.includes("text/html")) {
                        return caches.match("/index.html");
                    }
                });
        })
    );
});
