/* ============================================================
   perfil-data.js — Bancos de questões e conteúdo do Bloco 0
   Embarque Continuado · Estante Mágica
   Metodologias (adaptadas, para fins de desenvolvimento):
   - Tipologia estilo MBTI / 16personalities (4 eixos + Identidade)
   - Quociente de Positividade (QP) — inspirado em Positive Intelligence
   - Sabotadores — inspirado em Positive Intelligence (Shirzad Chamine)
   ============================================================ */

/* ---------- EIXOS DE PERSONALIDADE ---------- */
const EIXOS = {
  EI: { primeiro:"E", segundo:"I", nome:["Extroversão","Introversão"],
        resumo:["Recarrega no contato e pensa falando.","Recarrega na concentração e pensa antes de falar."] },
  SN: { primeiro:"S", segundo:"N", nome:["Sensorial","Intuitivo"],
        resumo:["Confia no concreto, nos fatos e no passo a passo.","Confia em padrões, ideias e possibilidades."] },
  TF: { primeiro:"T", segundo:"F", nome:["Racional","Afetivo"],
        resumo:["Decide pela lógica e pelos critérios.","Decide pelo impacto nas pessoas e nos valores."] },
  JP: { primeiro:"J", segundo:"P", nome:["Planejador","Prospector"],
        resumo:["Gosta de estrutura, planos e fechamento.","Gosta de flexibilidade, opções em aberto e adaptação."] },
  AT: { primeiro:"A", segundo:"T", nome:["Assertivo","Turbulento"],
        resumo:["Confiante e estável sob pressão.","Sensível, autocrítico e movido a melhorar."] }
};

/* ---------- ITENS DO TESTE DE TIPO (Likert 1-5) ----------
   ax = eixo · dir = +1 se concordar aponta para a 1ª letra; -1 para a 2ª */
const MBTI_ITENS = [
  // E / I
  { t:"Eu me energizo conversando com várias pessoas ao longo do dia.", ax:"EI", dir:1 },
  { t:"Prefiro pensar em voz alta com alguém a remoer a ideia sozinho(a).", ax:"EI", dir:1 },
  { t:"Depois de muitas interações, preciso de um tempo sozinho(a) para recarregar.", ax:"EI", dir:-1 },
  { t:"Costumo processar as coisas internamente antes de me posicionar.", ax:"EI", dir:-1 },
  // S / N
  { t:"Confio mais em fatos concretos e no que já foi testado.", ax:"SN", dir:1 },
  { t:"Gosto de instruções detalhadas e de seguir o passo a passo.", ax:"SN", dir:1 },
  { t:"Me empolgo com ideias novas e possibilidades futuras.", ax:"SN", dir:-1 },
  { t:"Costumo enxergar padrões e conexões antes dos detalhes.", ax:"SN", dir:-1 },
  // T / F
  { t:"Ao decidir, peso primeiro a lógica e os critérios objetivos.", ax:"TF", dir:1 },
  { t:"Prefiro ser justo(a) e direto(a), mesmo que a verdade incomode.", ax:"TF", dir:1 },
  { t:"Levo muito em conta como a decisão afeta as pessoas envolvidas.", ax:"TF", dir:-1 },
  { t:"Harmonia e empatia pesam tanto quanto a eficiência para mim.", ax:"TF", dir:-1 },
  // J / P
  { t:"Me sinto bem quando o dia está planejado e organizado.", ax:"JP", dir:1 },
  { t:"Gosto de fechar pendências e cumprir prazos com antecedência.", ax:"JP", dir:1 },
  { t:"Prefiro manter opções em aberto e decidir conforme as coisas surgem.", ax:"JP", dir:-1 },
  { t:"Trabalho bem na improvisação e me adapto fácil a mudanças de última hora.", ax:"JP", dir:-1 },
  // A / T (Identidade)
  { t:"Costumo confiar nas minhas decisões mesmo sob pressão.", ax:"AT", dir:1 },
  { t:"Erros e críticas não abalam tanto a minha autoconfiança.", ax:"AT", dir:1 },
  { t:"Costumo me cobrar muito e revisar bastante o que faço.", ax:"AT", dir:-1 },
  { t:"Fico ansioso(a) quando algo não sai como eu esperava.", ax:"AT", dir:-1 }
];

/* ---------- ITENS DO QUOCIENTE DE POSITIVIDADE (Likert 1-5) ----------
   positivo:true  -> mais concordância = mais QP
   positivo:false -> mais concordância = menos QP (reação sabotadora) */
const QP_ITENS = [
  { t:"Quando algo dá errado, consigo focar rápido na próxima ação útil.", positivo:true },
  { t:"Encaro desafios como oportunidade de aprender, não como ameaça.", positivo:true },
  { t:"Consigo manter a calma e a clareza mesmo em dias de pressão.", positivo:true },
  { t:"Reconheço e celebro pequenas vitórias minhas e do time.", positivo:true },
  { t:"Tendo a remoer erros e ficar preso(a) ao que deu errado.", positivo:false },
  { t:"Me pego comparando meu desempenho com o dos outros de forma negativa.", positivo:false },
  { t:"Quando estou sobrecarregado(a), reajo no automático/no impulso.", positivo:false },
  { t:"Levo crítica para o lado pessoal e fico remoendo por um tempo.", positivo:false }
];

/* ---------- ITENS DOS SABOTADORES (Likert 1-5) · 2 por sabotador ---------- */
const SAB_ITENS = [
  { t:"Eu me cobro (e cobro os outros) com um padrão difícil de alcançar.", sab:"juiz" },
  { t:"Tenho uma voz interna que aponta meus erros o tempo todo.", sab:"juiz" },
  { t:"Sinto necessidade de assumir o controle das situações.", sab:"controlador" },
  { t:"Fico incomodado(a) quando as coisas saem do meu jeito.", sab:"controlador" },
  { t:"Meu valor está muito ligado ao quanto eu produzo e entrego.", sab:"hiper-realizador" },
  { t:"Tenho dificuldade de parar; preciso estar sempre realizando algo.", sab:"hiper-realizador" },
  { t:"Antecipo o pior cenário e fico em alerta com o que pode dar errado.", sab:"hipervigilante" },
  { t:"Me preocupo bastante com riscos e imprevistos.", sab:"hipervigilante" },
  { t:"Estou sempre em busca da próxima coisa; me distraio com facilidade.", sab:"inquieto" },
  { t:"Tenho dificuldade de me manter no momento presente e numa tarefa só.", sab:"inquieto" },
  { t:"Priorizo agradar os outros, às vezes esquecendo das minhas necessidades.", sab:"agradador" },
  { t:"Tenho dificuldade de dizer 'não' e de pedir ajuda.", sab:"agradador" },
  { t:"Confio mais na razão e tenho dificuldade com o lado emocional.", sab:"hiper-racional" },
  { t:"Posso parecer distante ou analítico(a) demais nas relações.", sab:"hiper-racional" },
  { t:"Adio tarefas difíceis ou conversas desconfortáveis.", sab:"esquivo" },
  { t:"Evito conflitos mesmo quando precisaria me posicionar.", sab:"esquivo" },
  { t:"Em momentos difíceis, sinto que as coisas são injustas comigo.", sab:"vitima" },
  { t:"Tendo a focar no que está faltando ou no que está dando errado comigo.", sab:"vitima" },
  { t:"Sou perfeccionista; detalhes fora do lugar me incomodam muito.", sab:"rigido" },
  { t:"Tenho regras rígidas de certo e errado e pouca flexibilidade.", sab:"rigido" }
];

/* ---------- DESCRIÇÃO DOS SABOTADORES ---------- */
const SABOTADORES = {
  juiz:            { nome:"O Juiz", emoji:"⚖️", desc:"O sabotador-mestre: aponta seus erros, os dos outros e das circunstâncias. Todos o têm em algum grau.",
                     cs:"Pode te fazer remoer uma ligação que não converteu, em vez de partir para o próximo toque.", antidoto:"Nomeie a voz ('lá vem o Juiz') e redirecione para a próxima ação concreta." },
  controlador:     { nome:"O Controlador", emoji:"🎮", desc:"Ansiedade por ter tudo sob controle e moldar pessoas e situações.",
                     cs:"Pode atropelar a escuta da escola querendo conduzir a conversa do seu jeito.", antidoto:"Pratique perguntas abertas e deixe a escola falar 70% do tempo." },
  "hiper-realizador":{ nome:"O Hiper-Realizador", emoji:"🏆", desc:"Vincula autoestima ao desempenho e às conquistas; dificuldade de parar.",
                     cs:"Pode te levar à exaustão buscando metas e ignorando a qualidade do contato.", antidoto:"Defina 'pronto bom o suficiente' e celebre o processo, não só o número." },
  hipervigilante:  { nome:"O Hipervigilante", emoji:"🚨", desc:"Ansiedade constante com riscos e ameaças; vive em alerta.",
                     cs:"Pode te paralisar diante de uma carteira cheia, antecipando problemas.", antidoto:"Liste o que está sob seu controle e aja só nisso, um passo por vez." },
  inquieto:        { nome:"O Inquieto", emoji:"🦋", desc:"Busca constante por novidade e estímulo; dificuldade de focar.",
                     cs:"Pode te tirar do bloco de foco a cada notificação de WhatsApp ou chat.", antidoto:"Use blocos de foco por canal e silencie o resto durante o sprint." },
  agradador:       { nome:"O Agradador", emoji:"🤝", desc:"Busca aceitação agradando, ajudando e salvando os outros.",
                     cs:"Pode te impedir de gerar urgência ou dar um 'não' necessário para a escola.", antidoto:"Lembre que clareza é cuidado: um CTA firme ajuda a escola." },
  "hiper-racional":{ nome:"O Hiper-Racional", emoji:"🧠", desc:"Foco intenso e exclusivo no processamento racional de tudo.",
                     cs:"Pode te deixar técnico(a) demais e esfriar a conexão emocional com a gestora.", antidoto:"Nomeie a emoção da escola antes de trazer a solução racional." },
  esquivo:         { nome:"O Esquivo", emoji:"🙈", desc:"Evita conflitos e desconfortos; foca no positivo de forma exagerada.",
                     cs:"Pode te fazer adiar a ligação difícil ou a conversa de retenção.", antidoto:"Comece o dia pela tarefa que você está evitando (engole o sapo)." },
  vitima:          { nome:"A Vítima", emoji:"😔", desc:"Foca no sofrimento e no sentir-se incompreendido para ganhar atenção/afeto.",
                     cs:"Pode te fazer interpretar metas e feedbacks como injustiça.", antidoto:"Troque 'isso é injusto' por 'o que eu posso fazer com isso?'." },
  rigido:          { nome:"O Rígido", emoji:"📏", desc:"Perfeccionismo, ordem e organização levados ao extremo.",
                     cs:"Pode te fazer perder tempo polindo um CRM perfeito em vez de ligar.", antidoto:"Defina o nível de qualidade necessário e siga; feito > perfeito." }
};

/* ---------- SKILLS DE CS (iniciante) ---------- */
const SKILLS = {
  hard: [
    { nome:"Gestão de carteira & CRM (Ax)", desc:"Registrar contatos no mesmo dia, manter notas úteis e enxergar a saúde da carteira por etapa." },
    { nome:"Cadência & abordagem", desc:"Aplicar a cadência (ligação prioritária, duplo toque, revezamento) e manter 80% da base com contato efetivo." },
    { nome:"Qualidade de atendimento (Scorecard EM)", desc:"Escuta ativa, solução personalizada e CTA claro em cada call." },
    { nome:"Conhecimento de produto & jornada EM", desc:"Dominar prazos (EA, EM, FC, EG), benefícios e marcos da jornada." },
    { nome:"Ferramentas & tickets (Blip, Cal, Rachel)", desc:"Encerrar tickets corretamente e usar os canais de suporte com boas solicitações." },
    { nome:"Leitura de dados & dashboards", desc:"Usar filtros e relatórios do Ax para priorizar e planejar a semana." }
  ],
  soft: [
    { nome:"Escuta ativa & empatia", desc:"Acolher a necessidade real da escola antes de oferecer a solução." },
    { nome:"Comunicação & gestão para cima", desc:"Comunicar com clareza, antecipar status ao líder e trazer solução junto do problema." },
    { nome:"Organização & disciplina", desc:"Planejar o dia em blocos de foco e sustentar a rotina sem ser cobrado(a)." },
    { nome:"Resiliência & feedback", desc:"Receber feedback com abertura e aplicar rápido; não levar 'não' para o lado pessoal." },
    { nome:"Colaboração & cultura EM", desc:"Trabalhar em time, ajudar colegas e decidir pelos valores da Estante Mágica." },
    { nome:"Proatividade", desc:"Antecipar passos da jornada e agir sem esperar ser mandado(a)." }
  ]
};

/* ---------- 16 TIPOS ---------- */
const TIPOS = {
  INTJ:{nome:"Arquiteto(a)",emoji:"♟️",tag:"Estrategista independente e visionário(a).",
    forcas:["Pensamento estratégico e visão de longo prazo","Autonomia e alta exigência de qualidade","Aprende rápido e resolve problemas complexos"],
    atencao:["Pode parecer distante ou impaciente com processos","Tende a querer fazer tudo sozinho(a)"],
    cs:"Tende a otimizar a rotina e enxergar padrões na carteira, mas precisa cuidar do calor humano nas calls.",
    devHard:["Qualidade de atendimento (Scorecard EM)","Cadência & abordagem"],
    devSoft:["Escuta ativa & empatia","Colaboração & cultura EM"],
    gestor:"Dê autonomia e desafios de melhoria de processo; conecte o 'porquê' das tarefas. Trabalhe a conexão emocional nas calls e o pedir ajuda."},
  INTP:{nome:"Lógico(a)",emoji:"🔬",tag:"Pensador(a) curioso(a) e analítico(a).",
    forcas:["Análise lógica e curiosidade intelectual","Criatividade na solução de problemas","Flexibilidade de raciocínio"],
    atencao:["Pode se perder em análises e adiar a execução","Rotina e registros repetitivos cansam"],
    cs:"Domina o 'como funciona' do produto, mas pode descuidar do registro no CRM e da cadência constante.",
    devHard:["Gestão de carteira & CRM (Ax)","Cadência & abordagem"],
    devSoft:["Organização & disciplina","Comunicação & gestão para cima"],
    gestor:"Explique a lógica por trás dos padrões. Ajude a criar gatilhos de rotina e a transformar análise em ação rápida."},
  ENTJ:{nome:"Comandante",emoji:"📣",tag:"Líder natural, focado(a) em resultado.",
    forcas:["Orientação a metas e execução","Comunicação assertiva e confiança","Organização e visão de eficiência"],
    atencao:["Pode atropelar pessoas em nome do resultado","Impaciência com ritmo dos outros"],
    cs:"Bate metas e conduz a call com firmeza, mas precisa equilibrar urgência com escuta.",
    devHard:["Qualidade de atendimento (Scorecard EM)","Conhecimento de produto & jornada EM"],
    devSoft:["Escuta ativa & empatia","Colaboração & cultura EM"],
    gestor:"Dê metas claras e espaço para liderar iniciativas. Trabalhe paciência e empatia; modele escuta antes de CTA."},
  ENTP:{nome:"Inovador(a)",emoji:"💡",tag:"Debatedor(a) criativo(a) e versátil.",
    forcas:["Criatividade e improviso","Comunicação envolvente","Adapta-se rápido a cenários novos"],
    atencao:["Dispersão e dificuldade com tarefas repetitivas","Pode começar muito e finalizar pouco"],
    cs:"Cria conexões fáceis e contorna objeções, mas precisa de disciplina de cadência e fechamento.",
    devHard:["Cadência & abordagem","Gestão de carteira & CRM (Ax)"],
    devSoft:["Organização & disciplina","Resiliência & feedback"],
    gestor:"Traga variedade e desafios. Ajude a fechar o que começa, com blocos de foco e metas curtas."},
  INFJ:{nome:"Advogado(a)",emoji:"🕊️",tag:"Idealista atento(a) às pessoas.",
    forcas:["Empatia profunda e leitura das pessoas","Comprometimento com propósito","Comunicação cuidadosa"],
    atencao:["Pode se sobrecarregar absorvendo problemas alheios","Perfeccionismo e autocrítica"],
    cs:"Cria relações de confiança com as escolas, mas precisa cuidar do volume e do CTA firme.",
    devHard:["Cadência & abordagem","Qualidade de atendimento (Scorecard EM)"],
    devSoft:["Organização & disciplina","Resiliência & feedback"],
    gestor:"Conecte o trabalho ao propósito EM. Ajude a impor limites de tempo e a não levar tudo para o lado pessoal."},
  INFP:{nome:"Mediador(a)",emoji:"🌱",tag:"Idealista gentil e autêntico(a).",
    forcas:["Empatia e acolhimento genuíno","Criatividade e valores fortes","Adaptabilidade nas relações"],
    atencao:["Dificuldade com pressão de metas e conflito","Pode adiar tarefas operacionais"],
    cs:"Acolhe muito bem a escola, mas precisa de estrutura para sustentar cadência e gerar urgência.",
    devHard:["Cadência & abordagem","Gestão de carteira & CRM (Ax)"],
    devSoft:["Organização & disciplina","Comunicação & gestão para cima"],
    gestor:"Reforce o impacto positivo do trabalho nas crianças. Dê estrutura clara de rotina e segurança para dar CTAs."},
  ENFJ:{nome:"Protagonista",emoji:"🌟",tag:"Inspirador(a) e voltado(a) às pessoas.",
    forcas:["Comunicação calorosa e persuasiva","Foco em relações e no time","Energia para engajar"],
    atencao:["Pode se cobrar demais e querer agradar todos","Dificuldade de dizer não"],
    cs:"Engaja escolas e colegas com facilidade; precisa equilibrar acolhimento com firmeza nos números.",
    devHard:["Leitura de dados & dashboards","Qualidade de atendimento (Scorecard EM)"],
    devSoft:["Resiliência & feedback","Organização & disciplina"],
    gestor:"Aproveite o talento de engajamento (mentoria de colegas). Trabalhe limites e foco nos próprios indicadores."},
  ENFP:{nome:"Ativista",emoji:"🎉",tag:"Entusiasta criativo(a) e sociável.",
    forcas:["Entusiasmo contagiante e conexão fácil","Criatividade e otimismo","Boa comunicação"],
    atencao:["Dispersão e dificuldade com rotina","Empolga no começo e perde o fôlego"],
    cs:"Cria rapport instantâneo, mas precisa de disciplina de registro, cadência e fechamento.",
    devHard:["Gestão de carteira & CRM (Ax)","Cadência & abordagem"],
    devSoft:["Organização & disciplina","Resiliência & feedback"],
    gestor:"Celebre vitórias e traga variedade. Ajude com blocos de foco, checklists e acompanhamento próximo da rotina."},
  ISTJ:{nome:"Logístico(a)",emoji:"📚",tag:"Confiável, metódico(a) e responsável.",
    forcas:["Disciplina e consistência na rotina","Atenção a detalhes e a regras","Confiabilidade nas entregas"],
    atencao:["Pode resistir a mudanças e improvisos","Comunicação às vezes seca"],
    cs:"Excelente em rotina, CRM e cadência; precisa soltar mais na conexão e na flexibilidade com a escola.",
    devHard:["Qualidade de atendimento (Scorecard EM)","Leitura de dados & dashboards"],
    devSoft:["Escuta ativa & empatia","Proatividade"],
    gestor:"Dê processos claros — ele(a) brilha aí. Estimule iniciativa além do checklist e calor nas calls."},
  ISFJ:{nome:"Defensor(a)",emoji:"🛡️",tag:"Cuidadoso(a), leal e dedicado(a).",
    forcas:["Cuidado com as pessoas e atenção fina","Confiabilidade e dedicação","Boa escuta"],
    atencao:["Dificuldade de dizer não e de se expor","Pode evitar conflito e CTA firme"],
    cs:"Cuida muito bem das escolas; precisa ganhar confiança para gerar urgência e gerir o volume.",
    devHard:["Cadência & abordagem","Leitura de dados & dashboards"],
    devSoft:["Comunicação & gestão para cima","Resiliência & feedback"],
    gestor:"Ofereça segurança e reconhecimento. Treine assertividade no CTA e a comunicar necessidades ao líder."},
  ESTJ:{nome:"Executivo(a)",emoji:"🗂️",tag:"Organizador(a) prático(a) e direto(a).",
    forcas:["Organização e foco em execução","Clareza e objetividade","Responsabilidade com prazos"],
    atencao:["Rigidez e impaciência com exceções","Pode soar duro(a) nas relações"],
    cs:"Sustenta rotina e metas com facilidade; precisa de flexibilidade e empatia na escuta.",
    devHard:["Qualidade de atendimento (Scorecard EM)","Conhecimento de produto & jornada EM"],
    devSoft:["Escuta ativa & empatia","Colaboração & cultura EM"],
    gestor:"Dê responsabilidade e metas claras. Trabalhe escuta e flexibilidade diante de casos fora do padrão."},
  ESFJ:{nome:"Cônsul",emoji:"💛",tag:"Caloroso(a), colaborativo(a) e atento(a).",
    forcas:["Relações fortes e espírito de equipe","Atenção às necessidades das pessoas","Organização e cuidado"],
    atencao:["Busca aprovação e dificuldade com crítica","Pode evitar conversas difíceis"],
    cs:"Encanta as escolas e o time; precisa firmar CTAs e não levar feedback para o lado pessoal.",
    devHard:["Cadência & abordagem","Leitura de dados & dashboards"],
    devSoft:["Resiliência & feedback","Comunicação & gestão para cima"],
    gestor:"Reconheça publicamente o cuidado com o time. Treine resiliência a feedback e firmeza no fechamento."},
  ISTP:{nome:"Virtuoso(a)",emoji:"🔧",tag:"Prático(a), lógico(a) e mão na massa.",
    forcas:["Resolução prática de problemas","Calma sob pressão","Aprende fazendo"],
    atencao:["Pode achar a rotina/registros entediantes","Comunicação econômica demais"],
    cs:"Resolve pepinos com agilidade; precisa de constância na cadência e no registro, e de mais conexão.",
    devHard:["Gestão de carteira & CRM (Ax)","Cadência & abordagem"],
    devSoft:["Comunicação & gestão para cima","Colaboração & cultura EM"],
    gestor:"Dê problemas reais para resolver. Crie rotina leve de registro e estimule comunicar mais o que faz."},
  ISFP:{nome:"Aventureiro(a)",emoji:"🎨",tag:"Sensível, gentil e espontâneo(a).",
    forcas:["Empatia e atenção ao indivíduo","Adaptabilidade e leveza","Cuidado estético com o trabalho"],
    atencao:["Dificuldade com pressão e estrutura rígida","Pode adiar tarefas operacionais"],
    cs:"Trato gentil e personalizado com a escola; precisa de estrutura para cadência e metas.",
    devHard:["Cadência & abordagem","Gestão de carteira & CRM (Ax)"],
    devSoft:["Organização & disciplina","Resiliência & feedback"],
    gestor:"Dê liberdade dentro de uma estrutura clara. Acompanhe a rotina de perto e reforce o impacto do trabalho."},
  ESTP:{nome:"Empreendedor(a)",emoji:"🚀",tag:"Dinâmico(a), persuasivo(a) e ágil.",
    forcas:["Energia, agilidade e ação","Persuasão e jogo de cintura","Calma em situações de pressão"],
    atencao:["Impaciência com planejamento e detalhes","Pode pular etapas e registros"],
    cs:"Ótimo(a) em conversas e contorno de objeção; precisa de disciplina de processo e registro.",
    devHard:["Gestão de carteira & CRM (Ax)","Conhecimento de produto & jornada EM"],
    devSoft:["Organização & disciplina","Colaboração & cultura EM"],
    gestor:"Use desafios e metas de curto prazo. Reforce a importância do registro e do planejamento da semana."},
  ESFP:{nome:"Animador(a)",emoji:"✨",tag:"Espontâneo(a), caloroso(a) e comunicativo(a).",
    forcas:["Carisma e conexão imediata","Energia positiva e otimismo","Boa comunicação verbal"],
    atencao:["Dispersão e dificuldade com rotina","Foge de tarefas analíticas/repetitivas"],
    cs:"Cria rapport e encanta a escola; precisa de estrutura para sustentar cadência e dados.",
    devHard:["Gestão de carteira & CRM (Ax)","Leitura de dados & dashboards"],
    devSoft:["Organização & disciplina","Resiliência & feedback"],
    gestor:"Celebre conquistas e dê energia ao time. Ofereça checklists e acompanhamento próximo da rotina e dos números."}
};

/* Faixas de QP */
const QP_FAIXAS = [
  { min:0,  max:49, rotulo:"Em construção", cor:"var(--vermelho)",
    texto:"Sua mente ainda reage bastante no modo sabotador. Comece treinando pequenas pausas de respiração e o redirecionamento para a próxima ação útil." },
  { min:50, max:74, rotulo:"Em desenvolvimento", cor:"var(--laranja)",
    texto:"Você já equilibra razoavelmente reações positivas e sabotadoras. Fortaleça os músculos de foco no presente e de autocompaixão." },
  { min:75, max:100, rotulo:"Forte", cor:"var(--verde)",
    texto:"Sua mente serve a seu favor na maior parte do tempo. Continue cultivando e ajude o time a fazer o mesmo." }
];
