/* ============================================================
   Configuração do Senso de Conhecimento
   ------------------------------------------------------------
   Cole abaixo a URL /exec do seu Apps Script (depósito de
   respostas no Google). Veja o passo a passo em
   apps-script-senso-conhecimento.gs (na raiz do repositório).

   • ENDPOINT alimenta a planilha privada com as respostas.
   • O TOKEN secreto NÃO fica aqui — você digita na página de
     respostas (senso-conhecimento-respostas.html) na hora de
     analisar, pra não deixar a senha registrada no código.
   • TEMA: o tema do ciclo atual. A cada nova rodada, troque só
     este texto (ex.: "Envio para gráfica") — é a única coisa
     que precisa mudar para o tema do questionário.
   ============================================================ */
window.SENSO_CONFIG = {
  ENDPOINT: "https://script.google.com/macros/s/AKfycbz9d2MQUdr05-DHeTkCmDAAP9emsWaHhktelZQnZVUyHmFMFLD_SFWzdPjLJTX6dsqJ/exec",
  TEMA: "Kits da lojinha"
};
