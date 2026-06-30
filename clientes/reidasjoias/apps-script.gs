// ─────────────────────────────────────────────────────────────────────────────
// CSAT Rei das Joias — Google Apps Script (REFERÊNCIA / NÃO é executado pelo motor)
// ─────────────────────────────────────────────────────────────────────────────
// Este arquivo é só a fonte versionada. O código que roda de verdade vive no
// editor do Apps Script (Google), vinculado à planilha de respostas do rei.
//
// DEPLOY (pegadinha): o `/exec` serve a VERSÃO IMPLANTADA, não o último Ctrl+S.
//   1. Cola este código no editor → Ctrl+S.
//   2. Implantar → Gerenciar implantações → editar a implantação EXISTENTE (lápis).
//   3. Versão → "Nova versão" → Implantar. (Criar NOVA implantação gera URL nova
//      que a página não usa — sempre edite a existente.)
//   4. Confirme por: <URL>/exec?ping=1  →  {"pong":"v9","sheet":"PesquisaSatisfação"}
//
// v9: grava por NOME de coluna (lê o header row e mapeia header→coluna).
//     Independe da ordem das colunas; adicionar/reordenar coluna NÃO exige mexer
//     no script. codcliente/filial como TEXTO (preserva zeros à esquerda).
//     Dedup ("já respondeu") no doGet acha codcliente/data_venda por header.
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = 'PesquisaSatisfação'; // nome EXATO da aba de respostas do rei
const VERSION = 'v9';
const TEXT_COLS = ['codcliente', 'filial']; // gravadas como texto (zeros à esquerda)

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]; // fallback: 1ª aba
}

function headerMap_(sh) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var map = {};
  headers.forEach(function (h, i) {
    var key = String(h).trim().toLowerCase();
    if (key) map[key] = i + 1; // 1-indexed
  });
  return map;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var q = (e && e.parameter) || {};
    if (q.ping) return json_({ pong: VERSION, sheet: getSheet_().getName() });
    var sh = getSheet_();
    var map = headerMap_(sh);
    var values = sh.getDataRange().getDisplayValues();
    if (q.debug) return json_({ sheet: sh.getName(), rows: values.length - 1, headers: Object.keys(map) });
    var codcliente = (q.codcliente || '').trim();
    var data_venda = (q.data_venda || '').trim();
    if (!codcliente || !data_venda) return json_({ already_responded: false });
    var ci = map['codcliente'], di = map['data_venda'];
    if (!ci || !di) return json_({ already_responded: false, error: 'header codcliente/data_venda nao encontrado' });
    var ja = values.slice(1).some(function (row) {
      return String(row[ci - 1]).trim() === codcliente && String(row[di - 1]).trim() === data_venda;
    });
    return json_({ already_responded: ja });
  } catch (err) {
    return json_({ already_responded: false, error: err.message });
  }
}

function doPost(e) {
  try {
    var sh = getSheet_();
    var map = headerMap_(sh);
    var d = (e && e.parameter) || {};
    var r = sh.getLastRow() + 1;
    Object.keys(map).forEach(function (header) {
      var col = map[header];
      var val = d[header];
      if (val === undefined || val === null) val = '';
      if (TEXT_COLS.indexOf(header) !== -1 && val !== '') {
        sh.getRange(r, col).setFormula('="' + String(val).replace(/"/g, '') + '"');
      } else {
        sh.getRange(r, col).setValue(val);
      }
    });
    return json_({ status: 'ok', ok: true });
  } catch (err) {
    return json_({ status: 'error', ok: false, message: err.message });
  }
}
