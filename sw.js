const C="programma-v40-8";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=="programma-img").map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 // фото упражнений: из кэша, иначе из сети и в кэш навсегда
 if(u.hostname==="raw.githubusercontent.com"){e.respondWith(caches.open("programma-img").then(c=>c.match(r).then(m=>m||fetch(r).then(resp=>{if(resp.ok||resp.type==="opaque")c.put(r,resp.clone());return resp;}))));return;}
 if(u.origin!==location.origin)return;
 // страница: сначала сеть (чтобы обновления приходили), без сети — из кэша
 if(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html")){
  e.respondWith(fetch(r).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put("./index.html",cp));return resp;})
   .catch(()=>caches.match("./index.html")));return;}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(r,cp));return resp;})));});
