/* ============================================================
   pesquisa-data.js — Pesquisa de Comportamento
   Foco: escolas self-service (5k- PUBL) — aplicação e
   sensibilidade a preço (livro físico R$69,90 / R$89,90, 6x).
   Respostas em poucos cliques (toque único + 1 comentário opcional).
   ============================================================ */
const PESQUISA = {
  id: "comportamento-preco-v1",
  titulo: "Pesquisa de Comportamento — Sensibilidade a Preço",
  subtitulo: "Escolas self-service (perfil 5k- PUBL). Leva ~1 minuto, é só tocar nas opções.",
  /* e-mail da coordenação para receber as respostas (deixe vazio p/ a pessoa escolher) */
  emailCoordenacao: "",
  perguntas: [
    { id:"engajamento", t:"Como está o engajamento/aplicação das escolas self-service que você acompanha?",
      opcoes:["Muito baixo","Baixo","Médio","Alto","Muito alto"] },
    { id:"reacao_preco", t:"Quando o preço do livro físico entra na conversa, a reação mais comum é:",
      opcoes:["Aceitam numa boa","Hesitam um pouco","Acham caro","Recusam"] },
    { id:"capa_dura", t:"O preço da capa dura (R$ 89,90), na sua percepção:",
      opcoes:["Não assusta","Assusta um pouco","Assusta bastante"] },
    { id:"parcelamento", t:"O parcelamento em até 6x ajuda a destravar a venda?",
      opcoes:["Ajuda muito","Ajuda um pouco","Ajuda pouco","Não faz diferença"] },
    { id:"faixa_aceita", t:"Faixa de preço que a maioria dessas escolas aceitaria sem fricção:",
      opcoes:["Até R$ 49,90","R$ 59,90","R$ 69,90","R$ 79,90","R$ 89,90 ou mais"] },
    { id:"objecao", t:"Maior objeção que você ouve sobre preço:",
      opcoes:["Acham caro / fora do orçamento","Família não consegue pagar","Preferem o digital (grátis)","Não veem valor que justifique","Outra"] },
    { id:"comentario", t:"Algum detalhe sobre essas escolas? (opcional)",
      tipo:"texto", opcional:true }
  ]
};
