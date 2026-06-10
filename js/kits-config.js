/* ============================================================
   Configuração do Bate-papo dos Kits
   ------------------------------------------------------------
   Cole abaixo a URL /exec do seu Apps Script (depósito de
   respostas no Google). Veja o passo a passo em
   apps-script-kits.gs (na raiz do repositório).

   • ENDPOINT alimenta a planilha privada com as respostas.
   • O TOKEN secreto NÃO fica aqui — você digita na página de
     respostas (kits-respostas.html) na hora de analisar, pra
     não deixar a senha registrada no código.
   ============================================================ */
window.KITS_CONFIG = {
  ENDPOINT: "https://script.google.com/macros/s/AKfycbz9d2MQUdr05-DHeTkCmDAAP9emsWaHhktelZQnZVUyHmFMFLD_SFWzdPjLJTX6dsqJ/exec",

  // Tema do ciclo atual do Senso de Conhecimento.
  // A cada nova rodada, é só trocar este texto (ex.: "Envio para gráfica").
  TEMA: "Kits da lojinha"
};
