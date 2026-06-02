/* ============================================================
   autoconhecimento.js — Bloco 0
   Questionário (Perfil + QP + Sabotadores), cálculo e relatório.
   100% client-side (localStorage). Nada é enviado para servidores.
   ============================================================ */

const SECOES = [
  { id:"perfil", titulo:"Bloco 1 de 3 · Seu perfil",
    sub:"Como você funciona no dia a dia. Marque o quanto cada frase combina com você.",
    itens: MBTI_ITENS },
  { id:"qp", titulo:"Bloco 2 de 3 · Quociente de Positividade",
    sub:"Como sua mente reage aos desafios. Responda pensando no seu padrão mais comum.",
    itens: QP_ITENS },
  { id:"sab", titulo:"Bloco 3 de 3 · Sabotadores",
    sub:"Padrões internos que podem te atrapalhar. Quanto mais honesto(a), mais útil o resultado.",
    itens: SAB_ITENS }
];

const LIKERT = [
  { v:1, l:"Discordo\ntotalmente" },
  { v:2, l:"Discordo" },
  { v:3, l:"Neutro" },
  { v:4, l:"Concordo" },
  { v:5, l:"Concordo\ntotalmente" }
];

let secAtual = 0;
let respostas = SECOES.map(s => new Array(s.itens.length).fill(0));
let nome = "", gestor = "";

const $ = id => document.getElementById(id);

/* ---------- Entrada ---------- */
const inNome = $("in-nome");
try{ const s = localStorage.getItem("ec_nome"); if(s) inNome.value = s; }catch(e){}
inNome.focus();

$("btn-iniciar").addEventListener("click", iniciar);
inNome.addEventListener("keydown", e => { if(e.key === "Enter") iniciar(); });

function iniciar(){
  nome = inNome.value.trim();
  gestor = $("in-gestor").value.trim();
  if(!nome){ inNome.focus(); return; }
  try{ localStorage.setItem("ec_nome", nome); }catch(e){}
  $("tela-entrada").style.display = "none";
  $("tela-quiz").style.display = "block";
  renderStepper();
  renderSecao();
}

/* ---------- Stepper ---------- */
function renderStepper(){
  const nomes = ["Perfil","Positividade","Sabotadores"];
  $("stepper").innerHTML = nomes.map((n,i) =>
    `<div class="step-pill ${i===secAtual?'active':(i<secAtual?'done':'')}">
       <span class="n">Bloco ${i+1}</span>${n}</div>`
  ).join("");
}

/* ---------- Render de uma seção ---------- */
function renderSecao(){
  const sec = SECOES[secAtual];
  $("sec-titulo").textContent = sec.titulo;
  $("sec-sub").textContent = sec.sub;

  $("perguntas").innerHTML = sec.itens.map((item, i) => `
    <div class="q-card">
      <div class="q-num">Pergunta ${i+1} de ${sec.itens.length}</div>
      <div class="q-text">${item.t}</div>
      <div class="likert" data-i="${i}">
        ${LIKERT.map(o => `
          <button data-v="${o.v}" class="${respostas[secAtual][i]===o.v?'sel':''}">
            <span class="dot"></span>${o.l.replace(/\n/g,'<br>')}
          </button>`).join("")}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".likert").forEach(grp => {
    const i = +grp.dataset.i;
    grp.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => {
        respostas[secAtual][i] = +b.dataset.v;
        grp.querySelectorAll("button").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        atualizarProg();
      });
    });
  });

  $("btn-voltar").style.visibility = secAtual === 0 ? "hidden" : "visible";
  $("btn-avancar").textContent = secAtual === SECOES.length-1 ? "Ver meu relatório ✨" : "Avançar →";
  atualizarProg();
  window.scrollTo({top:0, behavior:"smooth"});
}

function atualizarProg(){
  const respondidas = respostas.flat().filter(v => v>0).length;
  const total = respostas.flat().length;
  $("prog").style.width = Math.round(respondidas/total*100) + "%";
  const completa = respostas[secAtual].every(v => v>0);
  $("btn-avancar").disabled = !completa;
}

$("btn-voltar").addEventListener("click", () => {
  if(secAtual>0){ secAtual--; renderStepper(); renderSecao(); }
});
$("btn-avancar").addEventListener("click", () => {
  if(!respostas[secAtual].every(v => v>0)) return;
  if(secAtual < SECOES.length-1){ secAtual++; renderStepper(); renderSecao(); }
  else gerarRelatorio();
});

/* ============================================================
   CÁLCULO
   ============================================================ */
function calcular(){
  // ----- Perfil (eixos) -----
  const eixoScore = { EI:0, SN:0, TF:0, JP:0, AT:0 };
  const eixoMax   = { EI:0, SN:0, TF:0, JP:0, AT:0 };
  MBTI_ITENS.forEach((item, i) => {
    eixoScore[item.ax] += item.dir * (respostas[0][i] - 3);
    eixoMax[item.ax]   += 2;
  });
  const eixos = {};
  ["EI","SN","TF","JP","AT"].forEach(ax => {
    const e = EIXOS[ax], score = eixoScore[ax], max = eixoMax[ax];
    const primeiro = score >= 0;
    eixos[ax] = {
      domLetra: primeiro ? e.primeiro : e.segundo,
      domNome:  primeiro ? e.nome[0] : e.nome[1],
      domResumo:primeiro ? e.resumo[0] : e.resumo[1],
      outroNome:primeiro ? e.nome[1] : e.nome[0],
      forca: Math.round(50 + Math.abs(score)/max*50) // 50..100
    };
  });
  const tipoCode = eixos.EI.domLetra + eixos.SN.domLetra + eixos.TF.domLetra + eixos.JP.domLetra;
  const identidade = eixos.AT.domLetra; // A ou T

  // ----- QP -----
  let qpSum = 0;
  QP_ITENS.forEach((item, i) => {
    const v = respostas[1][i];
    qpSum += item.positivo ? v : (6 - v);
  });
  const qp = Math.round(qpSum / (QP_ITENS.length*5) * 100);
  const qpFaixa = QP_FAIXAS.find(f => qp>=f.min && qp<=f.max);

  // ----- Sabotadores -----
  const sabScore = {};
  SAB_ITENS.forEach((item, i) => {
    sabScore[item.sab] = (sabScore[item.sab]||0) + respostas[2][i];
  });
  const sabRank = Object.keys(sabScore)
    .map(k => ({ key:k, score:sabScore[k], pct: Math.round(sabScore[k]/10*100) }))
    .sort((a,b) => b.score - a.score);
  const topSab = sabRank.slice(0,3);

  return { eixos, tipoCode, identidade, qp, qpFaixa, topSab };
}

function skillDesc(nomeSkill){
  const all = [...SKILLS.hard, ...SKILLS.soft];
  const s = all.find(x => x.nome === nomeSkill);
  return s ? s.desc : "";
}

/* ============================================================
   RELATÓRIO
   ============================================================ */
function gerarRelatorio(){
  const r = calcular();
  const tipo = TIPOS[r.tipoCode];
  const code = r.tipoCode + "-" + r.identidade;
  const idNome = r.identidade === "A" ? "Assertivo(a)" : "Turbulento(a)";
  const dataStr = new Date().toLocaleDateString("pt-BR", { day:"2-digit", month:"long", year:"numeric" });

  try{ localStorage.setItem("ec_perfil", JSON.stringify({nome, code, qp:r.qp, top:r.topSab.map(s=>s.key), data:Date.now()})); }catch(e){}

  const eixoOrdem = ["EI","SN","TF","JP","AT"];
  const eixosHTML = eixoOrdem.map(ax => {
    const e = r.eixos[ax];
    return `<div class="eixo">
      <div class="eixo-labels"><span class="on">${e.domNome}</span><span class="off">${e.outroNome}</span></div>
      <div class="eixo-bar"><div class="seg" style="left:0;width:${e.forca}%"></div></div>
      <div class="eixo-pct">${e.forca}% · ${e.domResumo}</div>
    </div>`;
  }).join("");

  const sabHTML = r.topSab.map((s, i) => {
    const d = SABOTADORES[s.key];
    return `<div class="sab-card">
      <div class="sab-h"><span>${d.emoji}</span>${d.nome}<span class="rank">${i===0?'Principal':'#'+(i+1)} · ${s.pct}%</span></div>
      <p>${d.desc}</p>
      <p><strong>No seu dia de CS:</strong> ${d.cs}</p>
      <div class="anti">💡 Antídoto: ${d.antidoto}</div>
    </div>`;
  }).join("");

  const devHardHTML = tipo.devHard.map(n =>
    `<div class="dev-item"><div class="dn">${n}</div><div class="dd">${skillDesc(n)}</div></div>`).join("");
  const devSoftHTML = tipo.devSoft.map(n =>
    `<div class="dev-item"><div class="dn">${n}</div><div class="dd">${skillDesc(n)}</div></div>`).join("");

  const topSabNome = SABOTADORES[r.topSab[0].key].nome;
  const gestorLinha = gestor ? `<strong>Para ${gestor}:</strong> ` : "";

  $("tela-relatorio").innerHTML = `
    <div class="report-head">
      <div class="report-brand">
        <img src="logo_EM.png" alt="Estante Mágica" class="report-logo"
             onerror="this.outerHTML='<div class=&quot;report-logo-fb&quot;>📚</div>'">
        <div class="report-brand-meta">
          <strong>Embarque Continuado</strong>
          <span>Relatório de Autoconhecimento</span>
        </div>
      </div>
      <div class="tipo-emoji">${tipo.emoji}</div>
      <div class="code">${code}</div>
      <h2>${tipo.nome}</h2>
      <div class="tag-linha">${tipo.tag}</div>
      <div class="report-meta">
        <span>👤 <strong>${nome}</strong></span>
        <span>🧑‍💼 Líder: <strong>${gestor || "—"}</strong></span>
        <span>📅 ${dataStr}</span>
      </div>
    </div>

    <div class="report-actions no-print">
      <button class="btn btn-primary btn-lg" onclick="window.print()">🖨️ Salvar / Imprimir (PDF)</button>
      <button class="btn btn-ghost btn-lg" onclick="location.reload()">↻ Refazer teste</button>
      <a class="btn btn-ghost btn-lg" href="rotina.html">Ir para a rotina →</a>
    </div>

    <div class="report-section">
      <h3>🧭 Seu perfil em 5 eixos</h3>
      <p style="color:var(--cinza-700);margin-bottom:18px">Você é do tipo <strong>${code} · ${tipo.nome} (${idNome})</strong>. As barras mostram para que lado você tende — não há lado certo, só o seu jeito.</p>
      ${eixosHTML}
    </div>

    <div class="report-section">
      <h3>💪 Suas potencialidades</h3>
      <ul class="lista-check">${tipo.forcas.map(f=>`<li>${f}</li>`).join("")}</ul>
      <h3 style="margin-top:22px">⚠️ Pontos de atenção</h3>
      <ul class="lista-check lista-watch">${tipo.atencao.map(a=>`<li>${a}</li>`).join("")}</ul>
      <div class="alert alert-info" style="margin-top:18px"><span class="icon">🎯</span><div><strong>Como isso aparece no CS:</strong> ${tipo.cs}</div></div>
    </div>

    <div class="report-section">
      <h3>☀️ Quociente de Positividade (QP)</h3>
      <div class="qp-box">
        <div class="qp-ring" style="--p:${r.qp}"><span>${r.qp}</span></div>
        <div style="flex:1;min-width:220px">
          <div class="pill pill-roxo" style="margin-bottom:8px">${r.qpFaixa.rotulo}</div>
          <p style="color:var(--cinza-700)">${r.qpFaixa.texto}</p>
        </div>
      </div>
    </div>

    <div class="report-section">
      <h3>🕵️ Seus sabotadores a vigiar</h3>
      <p style="color:var(--cinza-700);margin-bottom:14px">Todo mundo tem sabotadores. O objetivo não é eliminá-los, mas reconhecê-los para que não dirijam suas decisões. Estes são os seus mais ativos:</p>
      ${sabHTML}
    </div>

    <div class="report-section">
      <h3>🗺️ Seu mapa de desenvolvimento (CS iniciante)</h3>
      <p style="color:var(--cinza-700);margin-bottom:16px">Com base no seu perfil, estas são as competências para priorizar agora. Esse é seu ponto de partida — eleve a barra a partir daqui.</p>
      <div class="dev-grid">
        <div class="dev-col"><h4>🛠️ Hard Skills</h4>${devHardHTML}</div>
        <div class="dev-col"><h4>💛 Soft Skills</h4>${devSoftHTML}</div>
      </div>
    </div>

    <div class="report-section">
      <h3>👔 Relatório para o gestor</h3>
      <div class="gestor-box">
        <p style="margin-bottom:12px">${gestorLinha}${nome} tem perfil <strong>${tipo.nome} (${code})</strong>. ${tipo.cs}</p>
        <h4 style="font-size:14px;margin-bottom:8px">Como favorecer a integração e o desenvolvimento</h4>
        <p style="margin-bottom:12px">${tipo.gestor}</p>
        <ul class="lista-check" style="margin-bottom:12px">
          <li><strong>Positividade (QP ${r.qp} · ${r.qpFaixa.rotulo}):</strong> ${r.qpFaixa.texto}</li>
          <li><strong>Sabotador principal — ${topSabNome}:</strong> ${SABOTADORES[r.topSab[0].key].cs} Apoie com: ${SABOTADORES[r.topSab[0].key].antidoto}</li>
          <li><strong>Foco de hard skills:</strong> ${tipo.devHard.join(" · ")}</li>
          <li><strong>Foco de soft skills:</strong> ${tipo.devSoft.join(" · ")}</li>
        </ul>
        <div class="alert alert-success"><span class="icon">📌</span><div>Sugestão de check-in: combine 1 hard skill + 1 soft skill como foco do trimestre e revise no 1:1, usando o Mapa de Critérios do Estagiário CS como régua.</div></div>
      </div>
    </div>

    <p class="no-print" style="text-align:center;color:var(--cinza-400);font-size:13px;margin-top:24px">
      Relatório gerado localmente · ${new Date().toLocaleDateString('pt-BR')} · Metodologias adaptadas (MBTI/16personalities · Positive Intelligence) para fins de desenvolvimento.
    </p>
  `;

  $("tela-quiz").style.display = "none";
  $("tela-relatorio").style.display = "block";
  window.scrollTo({top:0, behavior:"smooth"});
}
