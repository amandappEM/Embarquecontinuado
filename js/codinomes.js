/* ============================================================
   codinomes.js — Codinomes adaptado ao vocabulário de CS
   Modos:
     • "pvp" — presencial, 2 times + Espião (pass-and-play)
     • "cpu" — contra a máquina (você = operativo Azul; Espião
               automático te dá dicas; o time Vermelho é a IA)
   ============================================================ */
const POOL = [
  "Ligação","WhatsApp","GChat","Carteira","Cadência","Sprint","Bloco de foco","Ticket",
  "Blip","Ax","Rachel","Template","Escuta ativa","Empatia","CTA","Urgência","Jornada",
  "Marco","EA","EM","FC","EG","Supply","Scorecard","Feedback","CRM","Dashboard","Prazo",
  "Engajamento","Retenção","Resgate","Antecipação","Gestora","Encantamento","Duplo toque",
  "Cobertura","Efetividade","Daily","Follow-up","Revezamento","Tag","Slot"
];

/* Mapa de temas para o Espião automático. Cada tema agrupa termos
   relacionados; uma palavra pode aparecer em vários temas, dando
   flexibilidade às dicas. A IA escolhe o tema que cobre mais cartas
   do seu time evitando a carta da morte e as do adversário. */
const TEMAS = {
  "Canais":      ["Ligação","WhatsApp","GChat","Follow-up","Duplo toque","Ticket","Blip"],
  "Conversa":    ["Escuta ativa","Empatia","Encantamento","Feedback","CTA","Ligação"],
  "Métricas":    ["Scorecard","Dashboard","Efetividade","Engajamento","Retenção","Cobertura"],
  "Ferramentas": ["CRM","Dashboard","Scorecard","Template","Tag","Blip","Ax","Rachel"],
  "Agenda":      ["Cadência","Sprint","Daily","Slot","Bloco de foco","Revezamento","Prazo"],
  "Tempo":       ["Prazo","Urgência","Antecipação","Cadência","Daily"],
  "Siglas":      ["EA","EM","FC","EG"],
  "Jornada":     ["Jornada","Marco","EA","EM","FC","EG","Antecipação"],
  "Recuperar":   ["Resgate","Retenção","Antecipação","Cobertura","Follow-up"],
  "Time":        ["Gestora","Carteira","Supply","Revezamento","Daily"],
  "Resultado":   ["Efetividade","Engajamento","Encantamento","Retenção","Resgate"]
};

const $   = id => document.getElementById(id);
const rnd = n  => Math.floor(Math.random()*n);
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ---- estado ---- */
let key=[], words=[], revealed=[], turno="azul", azulLeft=0, vermLeft=0, fim=false, spy=false;
let modo="pvp";              // "pvp" | "cpu"
let dificuldade="medio";     // "facil" | "medio" | "dificil"
const ACC = { facil:0.60, medio:0.80, dificil:0.92 };
const HUMANO = "azul";       // no modo cpu o jogador é o time Azul
let dica=null;               // dica atual exibida {label,n,meus}
let palpites=0, maxPalpites=0;
let logEntries=[];
let cpuPensando=false;       // trava cliques enquanto a IA joga
let azulInicial=0;           // quantas cartas azuis no começo (p/ registro)

/* ============================================================
   NOVO JOGO
   ============================================================ */
function novoJogo(){
  fim=false; spy=false; dica=null; palpites=0; maxPalpites=0; logEntries=[]; cpuPensando=false;
  words = shuffle([...POOL]).slice(0,25);
  revealed = new Array(25).fill(false);
  const comeca = Math.random() < 0.5 ? "azul" : "vermelho";
  turno = comeca;
  const outro = comeca === "azul" ? "vermelho" : "azul";
  // 9 do time que começa, 8 do outro, 7 neutros, 1 morte
  const cores = [];
  for(let i=0;i<9;i++) cores.push(comeca);
  for(let i=0;i<8;i++) cores.push(outro);
  for(let i=0;i<7;i++) cores.push("neutro");
  cores.push("morte");
  key = shuffle(cores);
  azulLeft = key.filter(c => c === "azul").length;
  vermLeft = key.filter(c => c === "vermelho").length;
  azulInicial = azulLeft;

  if(modo === "cpu"){
    log(comeca === HUMANO
      ? "🎲 Você (Azul) começa!"
      : "🎲 A máquina (Vermelho) começa!");
    render();
    if(turno === HUMANO) iniciarTurnoHumano();
    else setTimeout(turnoCPU, 600);
  } else {
    render();
  }
}

/* ============================================================
   ESPIÃO AUTOMÁTICO — escolhe a melhor dica para um time
   ============================================================ */
function darDica(team){
  const morteIdx = key.indexOf("morte");
  const morteRevelada = revealed[morteIdx];
  const morteW = words[morteIdx];
  const adv = team === "azul" ? "vermelho" : "azul";

  const setTime   = new Set(words.filter((w,i)=>!revealed[i] && key[i]===team));
  const setAdv    = new Set(words.filter((w,i)=>!revealed[i] && key[i]===adv));
  const setNeutro = new Set(words.filter((w,i)=>!revealed[i] && key[i]==="neutro"));

  let melhor=null;
  for(const [label,membros] of Object.entries(TEMAS)){
    const meus = membros.filter(w => setTime.has(w));
    if(meus.length === 0) continue;
    const temMorte = !morteRevelada && membros.includes(morteW);
    const advN = membros.filter(w => setAdv.has(w)).length;
    const neuN = membros.filter(w => setNeutro.has(w)).length;
    const score = meus.length*10 - advN*7 - neuN*2 - (temMorte ? 100 : 0);
    if(!melhor || score > melhor.score) melhor = { label, n:meus.length, score, meus };
  }
  if(!melhor){
    const sobra = [...setTime];
    return { label:"Termo", n:Math.min(sobra.length,1)||1, meus:sobra.slice(0,1) };
  }
  return { label:melhor.label, n:Math.min(melhor.n,3), meus:melhor.meus };
}

/* ============================================================
   TURNO HUMANO (modo cpu)
   ============================================================ */
function iniciarTurnoHumano(){
  turno = HUMANO;
  dica = darDica(HUMANO);
  maxPalpites = dica.n + 1;
  palpites = 0;
  log(`🧠 Seu Espião: «${dica.label} ${dica.n}»`);
  render();
}

/* ============================================================
   TURNO DA MÁQUINA (modo cpu) — Vermelho
   ============================================================ */
function turnoCPU(){
  if(fim) return;
  turno = "vermelho";
  cpuPensando = true;
  dica = null;
  render();

  const plano = darDica("vermelho");
  log(`🤖 Espião da máquina: «${plano.label} ${plano.n}»`);
  const acc = ACC[dificuldade];
  let restantes = plano.n;          // quantas tentativas a IA fará
  const meusHidden = () => words.map((w,i)=>i).filter(i=>!revealed[i] && key[i]==="vermelho");
  const temaPrior  = new Set(plano.meus);

  function passoCPU(){
    if(fim || restantes <= 0){ encerrarTurnoCPU(); return; }
    restantes--;

    const acertar = Math.random() < acc && meusHidden().length > 0;
    let alvo;
    if(acertar){
      // prefere cartas vermelhas do tema da dica
      const prior = meusHidden().filter(i => temaPrior.has(words[i]));
      const pool  = prior.length ? prior : meusHidden();
      alvo = pool[rnd(pool.length)];
    } else {
      // erro: na maioria das vezes uma neutra, às vezes azul, raramente a morte
      const r = Math.random();
      let cat;
      if(r < 0.70) cat = "neutro";
      else if(r < 0.93) cat = "azul";
      else cat = "morte";
      let cand = words.map((w,i)=>i).filter(i=>!revealed[i] && key[i]===cat);
      if(!cand.length) cand = words.map((w,i)=>i).filter(i=>!revealed[i] && key[i]!=="vermelho");
      if(!cand.length){ encerrarTurnoCPU(); return; }
      alvo = cand[rnd(cand.length)];
    }

    const cor = aplicarRevelacao(alvo);
    log(`🤖 Vermelho abriu «${words[alvo]}» → ${rotuloCor(cor)}`);
    render();

    if(cor === "morte"){ // máquina revelou a morte → você vence
      finalizar(`💀 A máquina revelou o Agente da Morte. Time AZUL (você) venceu! 🎉`);
      return;
    }
    if(azulLeft === 0){ finalizar("🔵 Time AZUL (você) venceu! 🎉"); return; }
    if(vermLeft === 0){ finalizar("🔴 A máquina (Vermelho) venceu! 😅"); return; }

    if(cor === "vermelho") setTimeout(passoCPU, 800);  // acertou: continua
    else encerrarTurnoCPU();                            // errou: passa a vez
  }
  setTimeout(passoCPU, 700);
}

function encerrarTurnoCPU(){
  cpuPensando = false;
  if(!fim) iniciarTurnoHumano();
}

/* ============================================================
   CLIQUE NA CARTA
   ============================================================ */
function escolher(i){
  if(fim || revealed[i]) return;
  if(spy){
    $("setup-msg").textContent = "Esconda a chave do Espião antes do time adivinhar 😉";
    return;
  }
  if(modo === "cpu"){ escolherCPU(i); return; }
  escolherPVP(i);
}

/* --- modo presencial (comportamento original) --- */
function escolherPVP(i){
  const cor = aplicarRevelacao(i);
  const outro = turno === "azul" ? "vermelho" : "azul";
  if(cor === "morte"){
    render();
    finalizar(`💀 Fim! O time ${turno.toUpperCase()} revelou o Agente da Morte. Vitória do time ${outro.toUpperCase()}!`);
    return;
  }
  if(azulLeft === 0){ render(); return finalizar("🔵 Time AZUL venceu! 🎉"); }
  if(vermLeft === 0){ render(); return finalizar("🔴 Time VERMELHO venceu! 🎉"); }
  if(cor !== turno) turno = outro;   // errou a própria cor → passa a vez
  render();
}

/* --- modo contra a máquina (você é o Azul) --- */
function escolherCPU(i){
  if(cpuPensando || turno !== HUMANO) return;
  const cor = aplicarRevelacao(i);
  palpites++;
  log(`🙋 Você abriu «${words[i]}» → ${rotuloCor(cor)}`);

  if(cor === "morte"){
    render();
    finalizar("💀 Você revelou o Agente da Morte! A máquina (Vermelho) venceu. 😬");
    return;
  }
  if(azulLeft === 0){ render(); return finalizar("🔵 Time AZUL (você) venceu! 🎉"); }
  if(vermLeft === 0){ render(); return finalizar("🔴 A máquina (Vermelho) venceu! 😅"); }

  if(cor === "azul"){
    if(palpites >= maxPalpites){      // chegou ao limite (número + 1)
      log("⏭️ Limite de tentativas — passa a vez.");
      render();
      setTimeout(turnoCPU, 700);
    } else {
      render();                       // acertou e ainda pode chutar
    }
  } else {                            // neutra ou adversária → passa a vez
    render();
    setTimeout(turnoCPU, 700);
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function aplicarRevelacao(i){
  revealed[i] = true;
  const cor = key[i];
  if(cor === "azul") azulLeft--;
  if(cor === "vermelho") vermLeft--;
  return cor;
}

function rotuloCor(cor){
  return ({azul:"🔵 Azul", vermelho:"🔴 Vermelho", neutro:"⚪ Neutra", morte:"💀 Morte"})[cor];
}

function finalizar(msg){
  fim = true; spy = true; cpuPensando = false; dica = null;
  log(msg);
  render();
  $("turno").innerHTML = `<strong>${msg}</strong>`;
  if(modo === "cpu" && window.EmbarqueTrack){
    EmbarqueTrack.log({
      jogo:"Codinomes", modo:"vs-maquina", dificuldade,
      resultado: msg.includes("AZUL") ? "vitoria" : "derrota",
      pontuacao: (azulInicial - azulLeft),          // cartas suas acertadas
      detalhe: msg.replace(/<[^>]+>/g,"").trim()
    });
  }
}

function log(msg){
  logEntries.unshift(msg);
  if(logEntries.length > 12) logEntries.pop();
}

/* ============================================================
   RENDER
   ============================================================ */
function render(){
  $("setup-msg").textContent = "";

  // placar
  $("placar").innerHTML = `
    <span class="pt azul">🔵 ${azulLeft}</span>
    <span class="pt vermelho">🔴 ${vermLeft}</span>`;

  // banner da dica (modo cpu)
  const banner = $("clue");
  if(modo === "cpu" && !fim){
    if(turno === HUMANO && dica){
      banner.className = "cod-clue azul";
      banner.innerHTML = `🧠 Seu Espião diz: <strong>«${dica.label} ${dica.n}»</strong>
        <span class="cod-tent">Tentativas: ${palpites}/${maxPalpites}</span>`;
    } else if(cpuPensando){
      banner.className = "cod-clue vermelho";
      banner.innerHTML = `🤖 A máquina está jogando…`;
    } else {
      banner.className = "cod-clue";
      banner.innerHTML = "";
    }
  } else {
    banner.className = "cod-clue";
    banner.innerHTML = "";
  }

  // turno
  $("turno").innerHTML = fim ? "" :
    `Vez do time <strong style="color:${turno==='azul'?'#3B82F6':'var(--vermelho)'}">${turno==='azul'?'AZUL 🔵':'VERMELHO 🔴'}</strong>`;

  // botões
  $("spy-btn").textContent = spy ? "🙈 Esconder chave" : "🕵️ Ver chave (Espião)";
  $("spy-btn").style.display  = (modo === "cpu") ? "none" : "";
  $("pass-btn").style.display = (modo === "cpu" && !fim && turno === HUMANO && !cpuPensando) ? "" : "none";

  // grid
  $("grid").innerHTML = words.map((w,i) => {
    let cls = "codcard";
    if(revealed[i]) cls += " reveal-" + key[i];
    else if(spy) cls += " spy-" + key[i];
    return `<div class="${cls}" data-i="${i}">${w}</div>`;
  }).join("");

  const podeClicar = !fim && (modo === "pvp" || (turno === HUMANO && !cpuPensando));
  document.querySelectorAll(".codcard").forEach(c => {
    const i = +c.dataset.i;
    if(!revealed[i] && podeClicar) c.addEventListener("click", () => escolher(i));
  });

  // log
  const box = $("log");
  if(box){
    box.innerHTML = logEntries.length
      ? "<h4>📜 Histórico</h4>" + logEntries.map(e=>`<div class="cod-log-line">${e}</div>`).join("")
      : "";
  }
}

/* ============================================================
   CONTROLES DE INTERFACE
   ============================================================ */
function setModo(m){
  modo = m;
  document.querySelectorAll("#modo-row .cod-modebtn").forEach(b =>
    b.classList.toggle("active", b.dataset.modo === m));
  $("diff-row").style.display = (m === "cpu") ? "" : "none";
  novoJogo();
}

function setDificuldade(d){
  dificuldade = d;
  document.querySelectorAll("#diff-row .cod-diffbtn").forEach(b =>
    b.classList.toggle("active", b.dataset.diff === d));
  novoJogo();
}

$("novo-btn").addEventListener("click", novoJogo);
$("spy-btn").addEventListener("click", () => { spy = !spy; render(); });
$("pass-btn").addEventListener("click", () => {
  if(modo === "cpu" && turno === HUMANO && !cpuPensando && !fim){
    log("⏭️ Você passou a vez.");
    turnoCPU();
  }
});
document.querySelectorAll("#modo-row .cod-modebtn").forEach(b =>
  b.addEventListener("click", () => setModo(b.dataset.modo)));
document.querySelectorAll("#diff-row .cod-diffbtn").forEach(b =>
  b.addEventListener("click", () => setDificuldade(b.dataset.diff)));

/* início */
setModo("pvp");
