/* Offline support. The page is fetched fresh when online; everything else is served from the cache. */
var V = "ma-mastery-117f2b7eb4";
var CORE = ["./", "app.bin", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable.png", "img/car.jpg", "img/clinic.jpg", "img/night.jpg", "img/office.jpg", "manifest.webmanifest"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener("fetch", function(e){
  var r = e.request; if(r.method !== "GET") return;
  if(r.mode === "navigate"){ e.respondWith(fetch(r).then(function(res){ var cp = res.clone(); caches.open(V).then(function(c){ c.put("./", cp); }); return res; }).catch(function(){ return caches.match("./"); })); return; }
  e.respondWith(caches.match(r).then(function(hit){ return hit || fetch(r).then(function(res){ if(res.ok || res.type === "opaque"){ var cp = res.clone(); caches.open(V).then(function(c){ c.put(r, cp); }); } return res; }); }));
});
