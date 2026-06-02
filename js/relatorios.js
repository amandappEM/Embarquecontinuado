/* ============================================================
   relatorios.js — consolida CSVs de uso (100% no navegador)
   ============================================================ */
const T = window.EmbarqueTrack;
const $g = id => document.getElementById(id);
function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

let consolidado = [];

function chave(e){ return [e.data,e.email,e.nome,e.jogo,e.modo,e.resultado,e.pontuacao,e.detalhe].join("|"); }

function carregar(files){
  const lista = Array.from(files);
  if(!lista.length) return;
  let lidos = 0, erros = 0;
  const vistos = new Set(consolidado.map(chave));
  let pend = lista.length;

  lista.forEach(f => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const objs = T.objetosDoCSV(fr.result);
        objs.forEach(o => { const k = chave(o); if(!vistos.has(k)){ vistos.add(k); consolidado.push(o); } });
        lidos++;
      } catch(e){ erros++; }
      if(--pend === 0) finalizado(lidos, erros);
    };
    fr.onerror = () => { erros++; if(--pend === 0) finalizado(lidos, erros); };
    fr.readAsText(f, "utf-8");
  });
}

function finalizado(lidos, erros){
  $g("rel-status").textContent =
    `${lidos} arquivo(s) processado(s)${erros?` · ${erros} com erro`:""} · ${consolidado.length} registro(s) únicos no total.`;
  render();
}

function tsDe(e){ const d = new Date(e.data); return isNaN(d) ? 0 : d.getTime(); }

function render(){
  if(!consolidado.length){ $g("rel-saida").innerHTML = ""; return; }

  const evs = consolidado.slice();
  const usuarios = {};   // email||nome -> {nome,email,n}
  const porJogo = {}, porModo = {}, porDif = {};
  let vit=0, der=0;
  let tmin=Infinity, tmax=-Infinity;

  evs.forEach(e => {
    const id = (e.email||e.nome||"(anônimo)").toLowerCase();
    if(!usuarios[id]) usuarios[id] = { nome:e.nome||"(anônimo)", email:e.email||"", n:0, vit:0 };
    usuarios[id].n++;
    if(e.resultado==="vitoria"){ vit++; usuarios[id].vit++; }
    if(e.resultado==="derrota") der++;
    porJogo[e.jogo||"—"] = (porJogo[e.jogo||"—"]||0)+1;
    porModo[`${e.jogo||"—"} · ${e.modo||"—"}`] = (porModo[`${e.jogo||"—"} · ${e.modo||"—"}`]||0)+1;
    if(e.dificuldade) porDif[e.dificuldade] = (porDif[e.dificuldade]||0)+1;
    const t = tsDe(e); if(t){ tmin=Math.min(tmin,t); tmax=Math.max(tmax,t); }
  });

  const nUsers = Object.keys(usuarios).length;
  const disputas = vit+der;
  const taxa = disputas ? Math.round(vit/disputas*100) : 0;
  const periodo = (tmin!==Infinity)
    ? `${new Date(tmin).toLocaleDateString("pt-BR")} – ${new Date(tmax).toLocaleDateString("pt-BR")}`
    : "—";

  const tabela = (obj) => Object.entries(obj).sort((a,b)=>b[1]-a[1])
    .map(([k,v])=>`<tr><td>${escH(k)}</td><td>${v}</td></tr>`).join("");

  const usersRows = Object.values(usuarios).sort((a,b)=>b.n-a.n).map(u=>`
    <tr><td>${escH(u.nome)}</td><td>${escH(u.email)}</td><td>${u.n}</td>
        <td>${u.vit}</td></tr>`).join("");

  $g("rel-saida").innerHTML = `
    <div class="card">
      <div class="pg-top">
        <h2 style="margin:0"><span class="icon">📈</span> Visão geral</h2>
        <button class="btn btn-primary" id="rel-exp">⬇️ Exportar CSV consolidado</button>
      </div>
      <p style="color:var(--cinza-700);margin-top:8px">Período: <strong>${periodo}</strong></p>
      <div class="res-stats">
        <div class="res-stat"><span class="rs-num">${evs.length}</span><span class="rs-lbl">partidas</span></div>
        <div class="res-stat"><span class="rs-num">${nUsers}</span><span class="rs-lbl">usuários</span></div>
        <div class="res-stat"><span class="rs-num">${vit}</span><span class="rs-lbl">vitórias</span></div>
        <div class="res-stat"><span class="rs-num">${taxa}%</span><span class="rs-lbl">aproveitamento</span></div>
      </div>
    </div>

    <div class="rel-cols">
      <div class="card">
        <h3 style="margin-top:0">🎮 Partidas por jogo</h3>
        <table class="ec-table"><thead><tr><th>Jogo</th><th>Partidas</th></tr></thead><tbody>${tabela(porJogo)}</tbody></table>
        <h3>🎛️ Por modo</h3>
        <table class="ec-table"><thead><tr><th>Jogo · Modo</th><th>Partidas</th></tr></thead><tbody>${tabela(porModo)}</tbody></table>
        ${Object.keys(porDif).length ? `<h3>🔥 Por dificuldade</h3>
        <table class="ec-table"><thead><tr><th>Dificuldade</th><th>Partidas</th></tr></thead><tbody>${tabela(porDif)}</tbody></table>` : ""}
      </div>
      <div class="card">
        <h3 style="margin-top:0">👥 Por usuário</h3>
        <div class="res-tab-wrap">
          <table class="ec-table">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Partidas</th><th>Vitórias</th></tr></thead>
            <tbody>${usersRows}</tbody>
          </table>
        </div>
      </div>
    </div>`;

  $g("rel-exp").onclick = () => {
    // ordena por data antes de exportar
    const ord = consolidado.slice().sort((a,b)=>tsDe(a)-tsDe(b));
    T.baixarCSV("embarque_consolidado_" + new Date().toISOString().slice(0,10) + ".csv", ord);
  };
}

$g("rel-files").addEventListener("change", e => carregar(e.target.files));
