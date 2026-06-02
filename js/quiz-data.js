/* ============================================================
   quiz-data.js — Perguntas do Perguntados (Arena Embarque)
   c = índice da alternativa correta (base 0)
   ============================================================ */
const CATEGORIAS = [
  { id:"carteira", nome:"Carteira", emoji:"🗂️", cor:"linear-gradient(135deg,#6B4EFF,#4A33B8)" },
  { id:"cadencia", nome:"Cadência", emoji:"📞", cor:"linear-gradient(135deg,#FF6B9D,#F59E0B)" },
  { id:"tickets",  nome:"Canais & Tickets", emoji:"✅", cor:"linear-gradient(135deg,#22C55E,#10B981)" },
  { id:"prazos",   nome:"Ajustes de Prazo", emoji:"📅", cor:"linear-gradient(135deg,#3B82F6,#6B4EFF)" }
];

const PERGUNTAS = {
  carteira: [
    { q:"O que é uma carteira saudável?", o:["Uma carteira com muitos clientes","Conhecer o momento das escolas e antecipar a jornada","Ter todos os tickets abertos","Falar com todo mundo todo dia"], c:1 },
    { q:"Qual é uma boa prática de revisão da carteira?", o:["Revisar só quando o líder pede","Reservar um tempo no início/fim da semana para analisar e planejar","Esperar a escola entrar em contato","Olhar apenas as escolas que respondem"], c:1 },
    { q:"Qual pergunta-guia ajuda na revisão semanal?", o:["Quem é meu cliente favorito?","Quais escolas estão atrasadas em relação aos marcos?","Qual escola tem o nome mais bonito?","Quantos e-mails eu enviei?"], c:1 },
    { q:"Gerir a carteira significa principalmente...", o:["Distribuir atenção e esforço de forma estratégica por impacto/urgência","Tratar todas as escolas exatamente igual","Focar só nas escolas grandes","Resolver apenas o que vira urgência"], c:0 },
    { q:"Qual recurso ajuda a ver a distribuição da carteira por etapas?", o:["O bloco de notas do celular","Filtros e dashboards do Ax","O grupo do WhatsApp","A agenda de papel"], c:1 },
    { q:"Sinal de boa gestão: conseguir apresentar o status da carteira em...", o:["1 hora","Um dia","5 minutos, a qualquer momento","Só na reunião mensal"], c:2 }
  ],
  cadencia: [
    { q:"Qual canal é prioritário no contato efetivo?", o:["E-mail","Ligação","WhatsApp","Chat"], c:1 },
    { q:"Qual a cadência de abordagem (tentativa) por dia?", o:["1 ligação só","2 ligações + canal escrito intercalado","5 e-mails","Apenas WhatsApp"], c:1 },
    { q:"Qual a meta de contato efetivo por semana?", o:["50% da base","80% da base","100% sempre","30% da base"], c:1 },
    { q:"O que caracteriza uma abordagem de qualidade?", o:["Ligar sempre no mesmo horário","Revezar contatos, canais e horários","Insistir no mesmo número","Tentar uma vez e desistir"], c:1 },
    { q:"Qual é um sinal de cadência NÃO saudável?", o:["Contato semanal com valor","Escolas com abordagem vencida","Registro feito no mesmo dia","Revezar horários"], c:1 },
    { q:"Um cliente que não interage com a gente tende a...", o:["Comprar mais","Ter alta probabilidade de retrair","Ficar igual","Pedir mais contato"], c:1 }
  ],
  tickets: [
    { q:"Por quanto tempo dura a janela de conversa livre no WhatsApp?", o:["12h","24h após a última mensagem do cliente","48h","1 semana"], c:1 },
    { q:"Por que encerrar um ticket mesmo sem resposta do cliente?", o:["Para garantir que futuras comunicações cheguem","Para deletar a escola","Porque o sistema exige","Para ganhar pontos"], c:0 },
    { q:"Quando um ticket PODE ficar aberto de um dia para o outro?", o:["Sempre que quiser","Escolas de dificílimo contato em últimos dias de FC/pré-EG","Quando você esquece","Nunca"], c:1 },
    { q:"Como se encerra um ticket na Blip?", o:["Deletando a conversa","Clicando no check e selecionando a tag do atendimento","Saindo do sistema","Bloqueando o cliente"], c:1 },
    { q:"Para acionar um canal de suporte via GChat, você digita...", o:["/socorro","/ajuda + nome do canal","/help","@suporte"], c:1 },
    { q:"O que melhora a qualidade da resposta de um suporte?", o:["Perguntar sem contexto","Incluir prints, dados e tentativas já feitas","Marcar urgência máxima sempre","Mandar áudio longo"], c:1 }
  ],
  prazos: [
    { q:"Quais prazos têm 'gordura' para ajuste?", o:["EA e EG","EM e FC","Início da criação e EA","Todos"], c:1 },
    { q:"Até quando EM e FC podem ser esticados?", o:["Até o EA","Até 2 dias antes do EG","Sem limite","Até o dia do EG"], c:1 },
    { q:"O EG (envio para gráfica) pode ser compartilhado com a escola?", o:["Sim","Não, é prazo interno","Só com a gestora","Depende"], c:1 },
    { q:"Por que ajustar prazos em pequenos blocos?", o:["É mais rápido","Gera senso de urgência e compromisso","Exigência do sistema","Reduz custo"], c:1 },
    { q:"Mexeu no EA — o que é obrigatório?", o:["Nada","Revisar e formalizar os demais prazos","Cancelar a produção","Avisar só o Supply"], c:1 },
    { q:"Quando os livros vão para produção?", o:["Quando a escola termina","Só no dia do EG","2 dias antes","No EA"], c:1 }
  ]
};
