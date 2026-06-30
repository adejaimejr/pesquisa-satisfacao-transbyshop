// ─────────────────────────────────────────────────────────────────────────────
// CSAT Rei das Joias — Google Apps Script (REFERÊNCIA / NÃO é executado pelo motor)
// ─────────────────────────────────────────────────────────────────────────────
// O código que roda de verdade vive no editor do Apps Script (Google), vinculado
// à planilha de respostas do rei. Este arquivo é só a fonte versionada.
//
// DEPLOY (pegadinha): o `/exec` serve a VERSÃO IMPLANTADA, não o último Ctrl+S.
//   1. Cola este código no editor → Ctrl+S.
//   2. Implantar → Gerenciar implantações → editar a implantação EXISTENTE (lápis).
//   3. Versão → "Nova versão" → Implantar. (Criar NOVA implantação gera URL nova
//      que a página não usa — sempre edite a existente.)
//   4. Confirme: <URL>/exec?ping=1  →  {"pong":"v10", ...}
//
// v10: DEDUP NO SERVIDOR. O doPost checa (codcliente+data_venda) ANTES de gravar
//      e NÃO grava duplicado (+ LockService contra envios simultâneos). Garantia
//      real de "não responde 2x" — independe de navegador/cache/cold-start.
//      Mantém v9: grava por NOME de coluna (independe da ordem); codcliente/filial
//      como TEXTO (setFormula, zeros à esquerda); dedup do doGet por header.
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = 'Respostas'; // nome EXATO da aba; fallback p/ 1ª aba abaixo
const VERSION = 'v10';
const TEXT_COLS = ['codcliente', 'filial']; // texto, preserva zeros à esquerda

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function headerMap_(sh) {
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var map = {};
  headers.forEach(function (h, i) {
    var key = String(h).trim().toLowerCase();
    if (key) map[key] = i + 1;
  });
  return map;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function isDup_(sh, map, codcliente, data_venda) {
  var ci = map['codcliente'], di = map['data_venda'];
  if (!ci || !di || !codcliente || !data_venda) return false;
  var values = sh.getDataRange().getDisplayValues();
  return values.slice(1).some(function (row) {
    return String(row[ci - 1]).trim() === codcliente && String(row[di - 1]).trim() === data_venda;
  });
}

function doGet(e) {
  try {
    var q = (e && e.parameter) || {};
    if (q.ping) return json_({ pong: VERSION, sheet: getSheet_().getName() });
    var sh = getSheet_();
    var map = headerMap_(sh);
    if (q.debug) {
      var values = sh.getDataRange().getDisplayValues();
      return json_({ sheet: sh.getName(), rows: values.length - 1, headers: Object.keys(map) });
    }
    var codcliente = (q.codcliente || '').trim();
    var data_venda = (q.data_venda || '').trim();
    if (!codcliente || !data_venda) return json_({ already_responded: false });
    if (!map['codcliente'] || !map['data_venda']) {
      return json_({ already_responded: false, error: 'header codcliente/data_venda nao encontrado' });
    }
    return json_({ already_responded: isDup_(sh, map, codcliente, data_venda) });
  } catch (err) {
    return json_({ already_responded: false, error: err.message });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (e2) { /* segue mesmo sem lock */ }
  try {
    var sh = getSheet_();
    var map = headerMap_(sh);
    var d = (e && e.parameter) || {};
    var codcliente = (d.codcliente || '').trim();
    var data_venda = (d.data_venda || '').trim();

    // DEDUP SERVER-SIDE: nao grava se ja existe (codcliente + data_venda)
    if (isDup_(sh, map, codcliente, data_venda)) {
      return json_({ status: 'ok', ok: true, duplicate: true });
    }

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
  } finally {
    try { lock.releaseLock(); } catch (e3) {}
  }
}
