/* =============================================================
   DEPÓSITO DE RESPOSTAS — Bate-papo dos Kits da Lojinha
   Google Apps Script (cole no editor de Apps Script da sua planilha)
   =============================================================

   PASSO A PASSO (≈5 min, feito só uma vez):

   1. Acesse https://sheets.google.com e crie uma planilha em branco
      (ela vai guardar as respostas e fica privada, só com o SEU login).
      Pode dar o nome de "Kits — Respostas".

   2. Nessa planilha, menu  Extensões → Apps Script.

   3. Apague o conteúdo do editor, cole TODO este arquivo e
      troque o valor de SECRET abaixo por uma senha sua
      (pode ser qualquer frase — é o "token" que você vai digitar
       na página de respostas pra ver os dados).

   4. Clique em  Implantar → Nova implantação → tipo "App da Web".
        • Executar como:  Eu (seu e-mail)
        • Quem tem acesso:  Qualquer pessoa
      Implantar e AUTORIZE quando pedir.

   5. Copie a URL que termina em /exec  e cole no arquivo
      js/kits-config.js (campo ENDPOINT). Pronto!

   (Importante: "Qualquer pessoa" libera só o ENVIO de respostas.
    A LEITURA dos dados exige o SECRET — sem a senha ninguém vê nada.)
*/

const SECRET = "TROQUE_POR_UMA_SENHA_SUA";   // <-- mude isto
const SHEET_NAME = "Respostas";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sh = getSheet_();
    sh.appendRow([
      new Date(),
      data.id || "",
      data.nome || "",
      data.grupo || "",
      data.p1 || "",
      data.p2 || "",
      data.p3 || "",
      (data.nota === null || data.nota === undefined) ? "" : data.nota,
      data.pq || ""
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const cb = e.parameter.callback;
  const token = e.parameter.token;
  let payload;
  if (token !== SECRET) {
    payload = { ok: false, error: "unauthorized" };
  } else {
    const sh = getSheet_();
    const values = sh.getDataRange().getValues();
    const rows = [];
    for (let i = 1; i < values.length; i++) {
      const r = values[i];
      if (!r[1] && !r[2]) continue;
      rows.push({
        ts: r[0], id: r[1], nome: r[2], grupo: r[3],
        p1: r[4], p2: r[5], p3: r[6], nota: r[7], pq: r[8]
      });
    }
    payload = { ok: true, rows: rows };
  }
  const out = JSON.stringify(payload);
  if (cb) {
    return ContentService.createTextOutput(cb + "(" + out + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(out)
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["Data", "ID", "Nome", "Grupo", "P1", "P2", "P3", "Nota", "Porque"]);
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
