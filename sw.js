/* ============================================================
   PAINEL DE CONTROLE PMV · VTM Mídia

   Este arquivo se apaga. Ele guardava o painel no aparelho, e o
   guardado passou a ter prioridade sobre o que está no GitHub —
   as atualizações não chegavam.

   Instalado, ele limpa tudo que havia sido guardado e se
   desinstala. Depois disso o painel busca sempre a versão do
   servidor.

   Criado por Carlos Pontes, João Victor Brito e Gustavo
   ============================================================ */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", ev => {
  ev.waitUntil((async () => {
    /* apaga tudo que foi guardado */
    const nomes = await caches.keys();
    await Promise.all(nomes.map(n => caches.delete(n)));

    /* e se desinstala */
    await self.registration.unregister();

    /* recarrega quem estiver com o painel aberto */
    const abas = await self.clients.matchAll({type: "window"});
    abas.forEach(aba => aba.navigate(aba.url));
  })());
});
