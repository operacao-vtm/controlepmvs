/* ============================================================
   PAINEL DE CONTROLE PMV · VTM Mídia

   Este arquivo guarda o painel no aparelho. Instalado, ele abre
   mesmo sem internet — o técnico está na avenida, e o sinal nem
   sempre acompanha.

   Criado por Carlos Pontes, João Victor Brito e Gustavo
   ============================================================ */

/* Trocando este número, o aparelho busca a versão nova. Suba o painel
   e mude aqui: é o que faz o celular largar o que tinha guardado. */
const VERSAO = "pmv-v2";

const GUARDAR = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

/* Na instalação, guarda o painel inteiro. */
self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(VERSAO)
      .then(c => c.addAll(GUARDAR))
      .then(() => self.skipWaiting())
  );
});

/* Numa versão nova, o que ficou para trás é apagado. */
self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(
        nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", ev => {
  const url = new URL(ev.request.url);

  /* A planilha sempre pela rede: dado guardado seria dado velho. */
  if(url.hostname.indexOf("script.google.com") >= 0 ||
     url.hostname.indexOf("nominatim") >= 0){
    return;
  }

  if(ev.request.method !== "GET") return;

  /* O painel: tenta a rede primeiro, sempre. Quem tem sinal recebe a
     versão nova; quem não tem, trabalha com a guardada. Sem isso, uma
     atualização no GitHub demoraria a chegar ao aparelho. */
  ev.respondWith(
    fetch(ev.request)
      .then(resp => {
        if(resp && resp.status === 200 && resp.type === "basic"){
          const copia = resp.clone();
          caches.open(VERSAO).then(c => c.put(ev.request, copia));
        }
        return resp;
      })
      .catch(() => caches.match(ev.request)
        .then(achado => achado || caches.match("./index.html")))
  );
});
