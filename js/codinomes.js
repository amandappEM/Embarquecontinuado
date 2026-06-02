/* ============================================================
   codinomes.js — Codinomes adaptado ao vocabulário de CS
   Modo presencial: 2 times + Espião (spymaster). Pass-and-play.
   ============================================================ */
const POOL = [
  "Ligação","WhatsApp","GChat","Carteira","Cadência","Sprint","Bloco de foco","Ticket",
  "Blip","Ax","Rachel","Template","Escuta ativa","Empatia","CTA","Urgência","Jornada",
  "Marco","EA","EM","FC","EG","Supply","Scorecard","Feedback","CRM","Dashboard","Prazo",
  "Engajamento","Retenção","Resgate","Antecipação","Gestora","Encantamento","Duplo toque",
  "Cobertura","Efetividade","Daily","Follow-up","Revezamento","Tag","Slot"
];

const $ = id => document.getElementById(id);
let key = [], words = [], revealed = [], turno = "azul", azulLeft = 0, vermLeft = 0, fim = false, spy = false;

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function novoJogo(){
  fim = false; spy = false;
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
  render();
}

function render(){
  $("setup-msg").textContent = "";
  $("placar").innerHTML = `
    <span class="pt azul">🔵 ${azulLeft}</span>
    <span class="pt vermelho">🔴 ${vermLeft}</span>`;
  $("turno").innerHTML = fim ? "" :
    `Vez do time <strong style="color:${turno==='azul'?'#3B82F6':'var(--vermelho)'}">${turno==='azul'?'AZUL 🔵':'VERMELHO 🔴'}</strong>`;
  $("spy-btn").textContent = spy ? "🙈 Esconder chave" : "🕵️ Ver chave (Espião)";

  $("grid").innerHTML = words.map((w,i) => {
    let cls = "codcard";
    if(revealed[i]) cls += " reveal-" + key[i];
    else if(spy) cls += " spy-" + key[i];
    return `<div class="${cls}" data-i="${i}">${w}</div>`;
  }).join("");

  document.querySelectorAll(".codcard").forEach(c => {
    const i = +c.dataset.i;
    if(!revealed[i] && !fim) c.addEventListener("click", () => escolher(i));
  });
}

function escolher(i){
  if(fim || revealed[i]) return;
  if(spy){ // não deixa revelar enquanto o espião está olhando
    $("setup-msg").textContent = "Esconda a chave do Espião antes do time adivinhar 😉";
    return;
  }
  revealed[i] = true;
  const cor = key[i];
  const outro = turno === "azul" ? "vermelho" : "azul";

  if(cor === "morte"){
    fim = true; render();
    fimDeJogo(`💀 Fim! O time ${turno.toUpperCase()} revelou o agente da morte. Vitória do time ${outro.toUpperCase()}!`);
    return;
  }
  if(cor === "azul") azulLeft--;
  if(cor === "vermelho") vermLeft--;

  if(azulLeft === 0){ fim = true; render(); return fimDeJogo("🔵 Time AZUL venceu! 🎉"); }
  if(vermLeft === 0){ fim = true; render(); return fimDeJogo("🔴 Time VERMELHO venceu! 🎉"); }

  // passa a vez se não acertou a própria cor
  if(cor !== turno) turno = outro;
  render();
}

function fimDeJogo(msg){
  spy = true; render(); // revela tudo no fim
  $("turno").innerHTML = `<strong>${msg}</strong>`;
}

$("novo-btn").addEventListener("click", novoJogo);
$("spy-btn").addEventListener("click", () => { spy = !spy; render(); });

novoJogo();
