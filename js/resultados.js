/* ============================================================
   resultados.js — tela "Meus resultados" (histórico + CSV + e-mail)
   ============================================================ */
const T = window.EmbarqueTrack;
const $r = id => document.getElementById(id);

function escH(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
const RES_LABEL = { vitoria:"🏆 Vitória", derrota:"❌ Derrota", concluido:"✅ Concluído" };

function stats(evs){
  let vit=0, der=0; const porJogo={};
  evs.forEach(e=>{ porJogo[e.jogo]=(porJogo[e.jogo]||0)+1; if(e.resultado==="vitoria")vit++; if(e.resultado==="derrota")der++; });
  const disputas = vit + der;
  const taxa = disputas ? Math.round(vit/disputas*100) : 0;
  return { total:evs.length, vit, der, taxa, disputas, porJogo };
}

function render(){
  const perfil = T.getPerfil();
  const cont = $r("res-conteudo");

  if(!perfil){
    cont.innerHTML = `
      <div class="card">
        <h2><span class="icon">🔒</span> Identifique-se para ver seus resultados</h2>
        <p>Seu nome e e-mail ficam guardados só neste navegador. A partir daí, cada partida de Perguntados e Codinomes (contra a máquina) é registrada aqui.</p>
        <button class="btn btn-primary btn-lg" id="r-entrar">Entrar para salvar</button>
      </div>`;
    $r("r-entrar").onclick = () => T.promptLogin(() => { T.renderBarra("#ec-identity"); render(); });
    return;
  }

  const evs = T.getEventos().slice().sort((a,b)=>b.ts-a.ts);
  const s = stats(evs);

  cont.innerHTML = `
    <div class="card">
      <div class="pg-top">
        <h2 style="margin:0"><span class="icon">📊</span> Resumo</h2>
        <span class="res-quem">${escH(perfil.nome)}</span>
      </div>
      <div class="res-stats">
        <div class="res-stat"><span class="rs-num">${s.total}</span><span class="rs-lbl">partidas</span></div>
        <div class="res-stat"><span class="rs-num">${s.vit}</span><span class="rs-lbl">vitórias</span></div>
        <div class="res-stat"><span class="rs-num">${s.der}</span><span class="rs-lbl">derrotas</span></div>
        <div class="res-stat"><span class="rs-num">${s.taxa}%</span><span class="rs-lbl">aproveitamento</span></div>
      </div>
      <div class="res-acts">
        <button class="btn btn-primary btn-lg" id="r-csv">📥 Baixar meu CSV</button>
        <button class="btn btn-ghost btn-lg" id="r-mail">✉️ Enviar pra mim</button>
        <button class="btn btn-ghost btn-lg" id="r-limpar">🗑️ Limpar histórico</button>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-top:0"><span class="icon">🕓</span> Histórico</h2>
      ${evs.length ? `
      <div class="res-tab-wrap">
        <table class="ec-table">
          <thead><tr><th>Data/Hora</th><th>Jogo</th><th>Modo</th><th>Dificuldade</th><th>Resultado</th><th>Pontos</th><th>Detalhe</th></tr></thead>
          <tbody>
            ${evs.map(e=>`<tr>
              <td>${escH(new Date(e.ts).toLocaleString("pt-BR"))}</td>
              <td>${escH(e.jogo)}</td>
              <td>${escH(e.modo)}</td>
              <td>${escH(e.dificuldade||"—")}</td>
              <td>${RES_LABEL[e.resultado]||escH(e.resultado||"—")}</td>
              <td>${escH(e.pontuacao===""?"—":e.pontuacao)}</td>
              <td>${escH(e.detalhe||"—")}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>` : `<p style="color:var(--cinza-700)">Você ainda não jogou nenhuma partida registrada. Bora pra <a href="arena.html">Arena</a>! 🎮</p>`}
    </div>`;

  $r("r-csv").onclick  = () => T.baixarCSV();
  $r("r-mail").onclick = () => T.enviarEmail();
  $r("r-limpar").onclick = () => {
    if(confirm("Apagar todo o seu histórico neste navegador? Esta ação não pode ser desfeita.")){
      T.limparEventos(); render();
    }
  };
}

render();
