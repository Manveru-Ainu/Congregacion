/* Recibe las notificaciones cuando la app está cerrada o en segundo plano */
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

messaging.onBackgroundMessage(function(payload) {
  const d = payload.data || {};
  const n = payload.notification || {};
  self.registration.showNotification(n.title || d.title || "Comunicación y Anuncios", {
    body: n.body || d.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: d.tag || undefined,
    data: { url: d.url || "./index.html" }
  });
});

// Al tocar la notificación: abrir la app
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./index.html";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list) {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
