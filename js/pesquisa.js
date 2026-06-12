/* ============================================================
   pesquisa.js — Pesquisa de Comportamento (poucos cliques)
   Salva respostas no navegador (localStorage) e exporta CSV.
   ============================================================ */
const T = window.EmbarqueTrack;
const $p = id => document.getElementById(id);
const KEY = "EC_PESQUISAS";
function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

let respostas = {};   // {perguntaId: valor}

/* ---------- storage ---------- */
function lerRespostas(){ try{ return JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ return []; } }
function salvarResposta(reg){ const all = lerRespostas(); all.push(reg); localStorage.setItem(KEY, JSON.stringify(all)); }

/* ---------- CSV ---------- */
function csvCell(v){ v=(v==null?"":String(v)); return /[",\n\r]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v; }
function toCSV(regs){
  const cols = ["Data/Hora","Nome","E-mail", ...PESQUISA.perguntas.map(p=>p.t)];
  const head = cols.map(csvCell).join(",");
  const linhas = regs.map(r => {
    const base = [ new Date(r.ts).toLocaleString("pt-BR"), r.nome||"", r.email||"" ];
    const ans  = PESQUISA.perguntas.map(p => r.respostas[p.id]||"");
    return [...base, ...ans].map(csvCell).join(",");
  });
  return [head, ...linhas].join("\r\n");
}
function baixarCSV(){
  const regs = lerRespostas();
  if(!regs.length){ alert("Ainda não há respostas salvas neste aparelho."); return; }
  const csv = "﻿" + toCSV(regs);
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "pesquisa_comportamento_" + new Date().toISOString().slice(0,10) + ".csv";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

/* ---------- e-mail p/ coordenação ---------- */
function enviarEmail(reg){
  const linhas = PESQUISA.perguntas.map(p => `• ${p.t}\n   → ${reg.respostas[p.id]||"(em branco)"}`);
  const corpo = `Pesquisa de Comportamento — ${reg.nome||"(anônimo)"}\n` +
                `${new Date(reg.ts).toLocaleString("pt-BR")}\n\n` + linhas.join("\n");
  location.href = "mailto:" + encodeURIComponent(PESQUISA.emailCoordenacao||"") +
    "?subject=" + encodeURIComponent("Pesquisa de Comportamento — resposta") +
    "&body=" + encodeURIComponent(corpo);
}

/* ---------- render ---------- */
function render(){
  $p("titulo-pesq").textContent = PESQUISA.titulo;
  $p("sub-pesq").textContent = PESQUISA.subtitulo;

  $p("perguntas").innerHTML = PESQUISA.perguntas.map((p, i) => {
    if(p.tipo === "texto"){
      return `<div class="pq-card" data-q="${p.id}">
        <div class="pq-num">${i+1}. ${escH(p.t)}</div>
        <textarea class="ec-input pq-texto" id="txt-${p.id}" rows="3" placeholder="Escreva aqui (opcional)…"></textarea>
      </div>`;
    }
    return `<div class="pq-card" data-q="${p.id}">
      <div class="pq-num">${i+1}. ${escH(p.t)}</div>
      <div class="pq-opts">
        ${p.opcoes.map(o=>`<button type="button" class="pq-chip" data-q="${p.id}" data-v="${escH(o)}">${escH(o)}</button>`).join("")}
      </div>
    </div>`;
  }).join("");

  document.querySelectorAll(".pq-chip").forEach(b => b.addEventListener("click", () => {
    const q = b.dataset.q;
    respostas[q] = b.dataset.v;
    document.querySelectorAll(`.pq-chip[data-q="${q}"]`).forEach(x => x.classList.toggle("sel", x === b));
    $p("pesq-msg").textContent = "";
  }));
}

function enviar(){
  // valida obrigatórias (todas de escolha única)
  const faltando = PESQUISA.perguntas.filter(p => p.tipo!=="texto" && !respostas[p.id]);
  if(faltando.length){
    $p("pesq-msg").textContent = `Faltou responder ${faltando.length} pergunta(s). É rapidinho 🙂`;
    const alvo = document.querySelector(`.pq-card[data-q="${faltando[0].id}"]`);
    if(alvo) alvo.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  // comentário livre
  const txt = $p("txt-comentario");
  if(txt) respostas["comentario"] = txt.value.trim();

  const perfil = (T && T.getPerfil()) || {nome:"(anônimo)", email:""};
  const reg = { ts: Date.now(), nome: perfil.nome, email: perfil.email, respostas: {...respostas} };
  salvarResposta(reg);     // backup local (offline)
  enviarCentral(reg);      // envia pra planilha central (mesma do Senso)
  telaObrigada(reg);
}

/* envia a resposta para o Google Sheets (Apps Script), aba "Pesquisa".
   Mesmo endpoint do Senso de Conhecimento; roteado pelo campo tipo. */
function enviarCentral(reg){
  const endpoint = (window.SENSO_CONFIG && window.SENSO_CONFIG.ENDPOINT) || "";
  if(!endpoint){ console.warn("SENSO_CONFIG.ENDPOINT não configurado — resposta salva apenas localmente."); return; }
  const payload = Object.assign({ tipo:"pesquisa", nome:reg.nome, email:reg.email }, reg.respostas);
  try{
    fetch(endpoint, {
      method:"POST", mode:"no-cors",
      headers:{ "Content-Type":"text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  }catch(e){ console.warn("Falha ao enviar resposta:", e); }
}

function telaObrigada(reg){
  $p("form-pesq").style.display = "none";
  $p("obrigada").style.display = "block";
  $p("obrigada").innerHTML = `
    <div class="card">
      <h2><span class="icon">✅</span> Obrigada pela resposta!</h2>
      <p>Sua resposta foi <strong>enviada para a planilha central</strong> e também guardada neste aparelho. Se preferir, dá pra enviar por e-mail ou baixar em CSV.</p>
      <div class="res-acts">
        <button class="btn btn-primary btn-lg" id="ob-mail">✉️ Enviar pra coordenação</button>
        <button class="btn btn-ghost btn-lg" id="ob-csv">📥 Baixar CSV (deste aparelho)</button>
        <button class="btn btn-ghost btn-lg" id="ob-nova">↻ Responder novamente</button>
      </div>
      <p style="color:var(--cinza-400);font-size:13px;margin-top:12px">Respostas salvas neste aparelho: <strong>${lerRespostas().length}</strong></p>
    </div>`;
  $p("ob-mail").onclick = () => enviarEmail(reg);
  $p("ob-csv").onclick = baixarCSV;
  $p("ob-nova").onclick = () => { respostas = {}; $p("obrigada").style.display="none"; $p("form-pesq").style.display="block"; render(); window.scrollTo({top:0,behavior:"smooth"}); };
}

render();
$p("btn-enviar").addEventListener("click", enviar);
$p("btn-csv-topo").addEventListener("click", baixarCSV);
