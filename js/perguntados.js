/* ============================================================
   perguntados.js — lógica do jogo Perguntados (Arena Embarque)
   ============================================================ */
const $ = id => document.getElementById(id);
let pontos = 0, acertos = 0, respondidasTotal = 0;
const feitas = {}; // categorias concluídas
let catAtual = null, idx = 0, ordem = [];

function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ---------- Tela de categorias ---------- */
function renderCategorias(){
  catAtual = null;
  $("placar-topo").textContent = `${pontos} pts · ${acertos}/${respondidasTotal} acertos`;
  const todasFeitas = CATEGORIAS.every(c => feitas[c.id]);
  $("jogo").innerHTML = `
    <div class="card">
      <h2><span class="icon">🎯</span> Escolha uma categoria</h2>
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
  const cat = CATEGORIAS.find(c => c.id === catAtual);
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

renderCategorias();
