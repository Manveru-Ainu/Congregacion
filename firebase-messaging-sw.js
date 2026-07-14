/* Muestra las notificaciones cuando la app está cerrada, minimizada o en segundo plano */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC-4ogGeFr0vsmTDXX4MIrtBtCaGy3HUmg",
  authDomain: "congregacion-5205e.firebaseapp.com",
  projectId: "congregacion-5205e",
  storageBucket: "congregacion-5205e.firebasestorage.app",
  messagingSenderId: "893688054828",
  appId: "1:893688054828:web:c7bb4f231a643bf610fd89"
});

const messaging = firebase.messaging();

function mostrar(d) {
  d = d || {};
  const titulo = d.title || "Comunicación y Anuncios";
  const icono = new URL("icon-192.png", self.registration.scope).href;
  return self.registration.showNotification(titulo, {
    body: d.body || "",
    icon: icono,
    badge: icono,
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { url: self.registration.scope }
  });
}

/* Mensajes de datos que manda el servidor */
messaging.onBackgroundMessage(function (payload) {
  const d = (payload && payload.data) || {};
  const n = (payload && payload.notification) || {};
  mostrar({ title: d.title || n.title, body: d.body || n.body, tag: d.tag });
});

/* Respaldo por si no pasa por onBackgroundMessage */
self.addEventListener("push", function (event) {
  if (!event.data) return;
  let p = {};
  try { p = event.data.json(); } catch (e) { return; }
  if (p.notification) return;
  const d = p.data || {};
  if (!d.title && !d.body) return;
  event.waitUntil(mostrar(d));
});

/* Al tocar la notificación: abrir o enfocar la app */
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (const c of list) {
        if (c.url.indexOf(self.registration.scope) === 0 && "focus" in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
