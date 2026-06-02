/* ============================================================
   perguntados.js — Perguntados (Arena Embarque)
   Modos:
     • Treino livre — escolha a categoria e responda no seu ritmo
     • Roleta vs Máquina — gire a roleta e dispute coroas contra a IA
   ============================================================ */
const $   = id => document.getElementById(id);
const rnd = n  => Math.floor(Math.random()*n);
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; }

const CORW = id => (CATEGORIAS.find(c=>c.id===id)||{}).solida || "#6B4EFF";
const CAT  = id => CATEGORIAS.find(c=>c.id===id);

/* ---------- estado treino livre ---------- */
let pontos = 0, acertos = 0, respondidasTotal = 0;
const feitas = {};
let catAtual = null, idx = 0, ordem = [];

/* ---------- estado roleta vs máquina ---------- */
let vsDiff = "medio";
const ACC = { facil:0.60, medio:0.78, dificil:0.92 };
let vez = "jogador";                                   // "jogador" | "maquina"
let coroas = { jogador:new Set(), maquina:new Set() };
let usados = {};                                       // catId -> Set de índices já usados na partida
let girando = false, rotacao = 0, fimVS = false;
const WHEEL = ["carteira","cadencia","tickets","prazos","carteira","cadencia","tickets","prazos"];

/* ============================================================
   MENU PRINCIPAL
   ============================================================ */
function menu(){
  $("placar-topo").textContent = "Arena";
  $("jogo").innerHTML = `
    <div class="card">
      <h2><span class="icon">🎮</span> Perguntados — escolha o modo</h2>
      <div class="pg-modes">
        <button class="pg-modecard" id="m-treino">
          <span class="pg-mc-emoji">📚</span>
          <strong>Treino livre</strong>
          <span class="pg-mc-desc">Escolha a categoria e responda no seu ritmo.</span>
        </button>
        <button class="pg-modecard" id="m-vs">
          <span class="pg-mc-emoji">🎡</span>
          <strong>Roleta vs Máquina</strong>
          <span class="pg-mc-desc">Gire a roleta e dispute coroas contra a IA.</span>
        </button>
      </div>

      <div class="cod-field" id="pg-diff-row" style="display:none">
        <span class="cod-field-label">Dificuldade da máquina</span>
        <div class="cod-segment">
          <button class="cod-diffbtn" data-diff="facil">🙂 Fácil</button>
          <button class="cod-diffbtn active" data-diff="medio">😎 Médio</button>
          <button class="cod-diffbtn" data-diff="dificil">🔥 Difícil</button>
        </div>
        <p class="pg-vs-rules">🎯 Objetivo: seja o primeiro a conquistar uma <strong>coroa em cada uma das ${CATEGORIAS.length} categorias</strong>. A roleta sorteia a categoria; acertou → ganha a coroa (se ainda não tiver) e <strong>gira de novo</strong>; errou → passa a vez.</p>
        <button class="btn btn-primary btn-lg" id="pg-start">🎡 Começar partida</button>
      </div>
    </div>`;

  $("m-treino").onclick = () => reiniciar();
  $("m-vs").onclick = () => {
    $("m-vs").classList.add("sel");
    $("m-treino").classList.remove("sel");
    $("pg-diff-row").style.display = "";
  };
  document.querySelectorAll("#pg-diff-row .cod-diffbtn").forEach(b =>
    b.addEventListener("click", () => {
      vsDiff = b.dataset.diff;
      document.querySelectorAll("#pg-diff-row .cod-diffbtn").forEach(x =>
        x.classList.toggle("active", x === b));
    }));
  $("pg-start").onclick = () => vsIniciar();
}

/* ============================================================
   TREINO LIVRE (modo clássico)
   ============================================================ */
function renderCategorias(){
  catAtual = null;
  $("placar-topo").textContent = `${pontos} pts · ${acertos}/${respondidasTotal} acertos`;
  const todasFeitas = CATEGORIAS.every(c => feitas[c.id]);
  $("jogo").innerHTML = `
    <div class="card">
      <div class="pg-top">
        <h2 style="margin:0"><span class="icon">🎯</span> Escolha uma categoria</h2>
        <button class="pg-menu" onclick="menu()">← Menu</button>
      </div>
      <p style="color:var(--cinza-700)">Cada categoria tem uma rodada de perguntas. Acerte para somar pontos!</p>
      <div class="cat-grid">
        ${CATEGORIAS.map(c => `
          <button class="cat" data-cat="${c.id}" data-done="${feitas[c.id]?1:0}" style="background:${c.cor}">
            <span class="ce">${c.emoji}</span>${c.nome}
            ${feitas[c.id]?'<div style="font-size:12px;margin-top:6px;opacity:.9">✓ concluída</div>':''}
          </button>`).join("")}
      </div>
      ${todasFeitas ? `<div class="cta-complete" style="margin-top:8px">
        <h3>🏆 Você completou todas as categorias!</h3>
        <p>Pontuação final: ${pontos} pontos · ${acertos} de ${respondidasTotal} acertos.</p>
        <button class="btn-white" onclick="reiniciar()">Jogar de novo</button>
      </div>` : ''}
    </div>`;
  document.querySelectorAll(".cat").forEach(b =>
    b.addEventListener("click", () => iniciarCategoria(b.dataset.cat)));
}

function iniciarCategoria(id){
  catAtual = id; idx = 0;
  ordem = shuffle([...PERGUNTAS[id].keys()]);
  renderPergunta();
}

function renderPergunta(){
  const cat = CAT(catAtual);
  const p = PERGUNTAS[catAtual][ordem[idx]];
  const opcoes = p.o.map((txt, i) => ({txt, correta: i === p.c}));
  $("jogo").innerHTML = `
    <div class="pgame">
      <div class="scorebar"><span>${cat.emoji} ${cat.nome}</span><span>${pontos} pts</span></div>
      <div class="prog-wrap"><div class="fill" style="width:${(idx)/PERGUNTAS[catAtual].length*100}%"></div></div>
      <div style="font-size:12px;color:var(--cinza-400);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Pergunta ${idx+1} de ${PERGUNTAS[catAtual].length}</div>
      <div class="pq">${p.q}</div>
      <div id="opts">
        ${opcoes.map((o,i)=>`<button class="popt" data-correct="${o.correta?1:0}" data-i="${i}">${o.txt}</button>`).join("")}
      </div>
      <div id="next-wrap" style="margin-top:16px;display:none">
        <button class="btn btn-primary btn-lg" id="btn-next"></button>
      </div>
    </div>`;
  document.querySelectorAll(".popt").forEach(b => b.addEventListener("click", () => responder(b)));
}

function responder(btn){
  const opts = document.querySelectorAll(".popt");
  opts.forEach(o => {
    o.disabled = true;
    if(o.dataset.correct === "1") o.classList.add("correct");
  });
  respondidasTotal++;
  const acertou = btn.dataset.correct === "1";
  if(acertou){ acertos++; pontos += 10; }
  else { btn.classList.add("wrong"); }

  const nextWrap = $("next-wrap");
  const btnNext = $("btn-next");
  const ultima = idx === PERGUNTAS[catAtual].length - 1;
  btnNext.textContent = ultima ? "Concluir categoria ✓" : "Próxima →";
  nextWrap.style.display = "block";
  btnNext.onclick = () => {
    if(ultima){ feitas[catAtual] = true; renderCategorias(); }
    else { idx++; renderPergunta(); }
  };
}

function reiniciar(){
  pontos = 0; acertos = 0; respondidasTotal = 0;
  Object.keys(feitas).forEach(k => delete feitas[k]);
  renderCategorias();
}

/* ============================================================
   ROLETA VS MÁQUINA
   ============================================================ */
function vsIniciar(){
  coroas = { jogador:new Set(), maquina:new Set() };
  usados = {}; rotacao = 0; girando = false; fimVS = false;
  renderVsScreen();
  vezJogador();
}

function buildWheel(){
  const seg = 360 / WHEEL.length;
  const stops = WHEEL.map((id,i)=>`${CORW(id)} ${i*seg}deg ${(i+1)*seg}deg`).join(",");
  const emojis = WHEEL.map((id,i)=>{
    const ang = i*seg + seg/2;
    return `<span class="roleta-emoji" style="transform:translate(-50%,-50%) rotate(${ang}deg) translateY(-104px) rotate(${-ang}deg)">${CAT(id).emoji}</span>`;
  }).join("");
  return `
    <div class="roleta">
      <div class="roleta-pointer"></div>
      <div class="roleta-disc" id="roleta-disc" style="background:conic-gradient(${stops})">
        ${emojis}
        <div class="roleta-hub">🎡</div>
      </div>
    </div>`;
}

function crownsRow(quem){
  return CATEGORIAS.map(c=>{
    const tem = coroas[quem].has(c.id);
    return `<span class="pg-crown ${tem?'on':''}" title="${c.nome}" style="${tem?`background:${CORW(c.id)};border-color:${CORW(c.id)}`:''}">${c.emoji}</span>`;
  }).join("");
}

function renderVsScreen(){
  $("jogo").innerHTML = `
    <div class="card">
      <div class="pg-top">
        <h2 style="margin:0"><span class="icon">🎡</span> Roleta vs Máquina</h2>
        <button class="pg-menu" onclick="menu()">← Menu</button>
      </div>
      <div class="pg-board">
        <div class="pg-player"><span class="pg-player-name">🙋 Você</span><div class="pg-crowns" id="cr-jogador">${crownsRow("jogador")}</div></div>
        <div class="pg-player"><span class="pg-player-name">🤖 Máquina</span><div class="pg-crowns" id="cr-maquina">${crownsRow("maquina")}</div></div>
      </div>
      <div class="pg-turn" id="pg-turn"></div>
      ${buildWheel()}
      <div id="pg-stage"></div>
      <div id="pg-controls"></div>
    </div>`;
  atualizarPlacarTopo();
}

function atualizarCoroas(){
  if($("cr-jogador")) $("cr-jogador").innerHTML = crownsRow("jogador");
  if($("cr-maquina")) $("cr-maquina").innerHTML = crownsRow("maquina");
  atualizarPlacarTopo();
}
function atualizarPlacarTopo(){
  $("placar-topo").textContent = `👑 ${coroas.jogador.size} você · ${coroas.maquina.size} máquina`;
}

/* gira a roleta e chama cb(catId) ao parar */
function girarRoleta(cb){
  const disc = $("roleta-disc");
  const seg = 360 / WHEEL.length;
  const target = rnd(WHEEL.length);
  const centro = target*seg + seg/2;
  const base = Math.ceil((rotacao + 1)/360) * 360;
  rotacao = base + 360*4 + (360 - centro);     // 4 voltas + alinha o alvo ao topo
  disc.style.transform = `rotate(${rotacao}deg)`;

  let called = false;
  const done = () => {
    if(called) return; called = true;
    disc.removeEventListener("transitionend", done);
    cb(WHEEL[target]);
  };
  disc.addEventListener("transitionend", done);
  setTimeout(done, 4300);                       // fallback caso transitionend não dispare
}

function sortearPergunta(catId){
  const total = PERGUNTAS[catId].length;
  if(!usados[catId]) usados[catId] = new Set();
  if(usados[catId].size >= total) usados[catId].clear();
  let i; do { i = rnd(total); } while(usados[catId].has(i));
  usados[catId].add(i);
  return PERGUNTAS[catId][i];
}

function revelarOpts(scopeSel, correta, escolhida){
  document.querySelectorAll(`${scopeSel} .popt`).forEach(o => {
    o.disabled = true;
    const i = +o.dataset.i;
    if(i === correta) o.classList.add("correct");
    if(i === escolhida && escolhida !== correta) o.classList.add("wrong");
  });
}

/* ---- turno do jogador ---- */
function vezJogador(){
  if(fimVS) return;
  vez = "jogador";
  $("pg-turn").innerHTML = "🙋 <strong>Sua vez!</strong> Gire a roleta.";
  $("pg-stage").innerHTML = "";
  controlsGirar();
}

function controlsGirar(){
  $("pg-controls").innerHTML = `<button class="btn btn-primary btn-lg" id="btn-girar">🎡 Girar a roleta</button>`;
  $("btn-girar").onclick = () => {
    if(girando || fimVS) return;
    girando = true;
    $("btn-girar").disabled = true;
    $("pg-turn").innerHTML = "🎡 Girando…";
    girarRoleta(catId => { girando = false; perguntaJogador(catId); });
  };
}

function perguntaJogador(catId){
  const cat = CAT(catId);
  const p = sortearPergunta(catId);
  $("pg-turn").innerHTML = `🎯 Caiu em <strong style="color:${CORW(catId)}">${cat.emoji} ${cat.nome}</strong> — responda!`;
  $("pg-controls").innerHTML = "";
  $("pg-stage").innerHTML = `
    <div class="pg-qbox" id="pg-opts">
      <div class="pq">${p.q}</div>
      ${p.o.map((t,i)=>`<button class="popt" data-i="${i}">${t}</button>`).join("")}
    </div>`;
  document.querySelectorAll("#pg-opts .popt").forEach(b =>
    b.addEventListener("click", () => {
      const escolha = +b.dataset.i;
      revelarOpts("#pg-opts", p.c, escolha);
      setTimeout(() => resolverJogador(escolha === p.c, catId), 850);
    }));
}

function resolverJogador(ok, catId){
  if(ok){
    const novo = !coroas.jogador.has(catId);
    coroas.jogador.add(catId);
    atualizarCoroas();
    if(coroas.jogador.size === CATEGORIAS.length){ return fimDeJogoVS("jogador"); }
    $("pg-turn").innerHTML = novo
      ? `👑 <strong>Coroa de ${CAT(catId).nome}!</strong> Gire de novo.`
      : `✅ Acertou! Gire de novo.`;
    $("pg-stage").innerHTML = "";
    controlsGirar();
  } else {
    $("pg-turn").innerHTML = "❌ Errou! Passa a vez para a máquina.";
    $("pg-controls").innerHTML = "";
    setTimeout(vezMaquina, 1300);
  }
}

/* ---- turno da máquina ---- */
function vezMaquina(){
  if(fimVS) return;
  vez = "maquina";
  $("pg-turn").innerHTML = "🤖 <strong>Vez da máquina…</strong>";
  $("pg-stage").innerHTML = "";
  $("pg-controls").innerHTML = "";
  setTimeout(() => girarRoleta(catId => maquinaResponde(catId)), 700);
}

function maquinaResponde(catId){
  const cat = CAT(catId);
  const p = sortearPergunta(catId);
  const ok = Math.random() < ACC[vsDiff];
  $("pg-turn").innerHTML = `🤖 Máquina caiu em <strong style="color:${CORW(catId)}">${cat.emoji} ${cat.nome}</strong>`;
  $("pg-stage").innerHTML = `
    <div class="pg-qbox">
      <div class="pq pq-sm">${p.q}</div>
      <div class="pg-maq" id="pg-maq">🤖 pensando…</div>
    </div>`;
  setTimeout(() => {
    const maq = $("pg-maq");
    if(maq){
      maq.textContent = ok ? "✅ A máquina acertou!" : "❌ A máquina errou!";
      maq.className = "pg-maq " + (ok ? "ok" : "no");
    }
    setTimeout(() => {
      if(ok){
        const novo = !coroas.maquina.has(catId);
        coroas.maquina.add(catId);
        atualizarCoroas();
        if(coroas.maquina.size === CATEGORIAS.length){ return fimDeJogoVS("maquina"); }
        $("pg-turn").innerHTML = novo
          ? `👑 A máquina conquistou ${CAT(catId).nome}. Ela gira de novo…`
          : `🤖 Acertou e gira de novo…`;
        setTimeout(() => girarRoleta(c => maquinaResponde(c)), 900);
      } else {
        vezJogador();
      }
    }, 850);
  }, 950);
}

function fimDeJogoVS(quem){
  fimVS = true; girando = false;
  const venceu = quem === "jogador";
  $("pg-turn").innerHTML = venceu
    ? "🏆 <strong>Você venceu!</strong> Completou as 4 coroas! 🎉"
    : "🤖 <strong>A máquina venceu</strong> desta vez. Bora a revanche!";
  $("pg-stage").innerHTML = `
    <div class="cta-complete pg-fim ${venceu?'win':'lose'}">
      <h3>${venceu ? '🎉 Vitória!' : '😅 Quase!'}</h3>
      <p>Coroas — Você: ${coroas.jogador.size} · Máquina: ${coroas.maquina.size}</p>
    </div>`;
  $("pg-controls").innerHTML = `
    <button class="btn btn-primary btn-lg" onclick="vsIniciar()">🔄 Revanche</button>
    <button class="btn btn-ghost btn-lg" onclick="menu()" style="margin-left:8px">← Menu</button>`;
}

/* início */
menu();
