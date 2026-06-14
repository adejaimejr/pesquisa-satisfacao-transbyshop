#!/bin/sh
set -e

# ── Motor multi-tenant ──
# Para cada pasta em /clientes/<slug>/:
#   1. carrega config.env (cores/marca/domínio)
#   2. renderiza o template (envsubst SÓ dos nossos tokens — NUNCA os ${} do JS)
#   3. injeta o Apps Script URL do cliente (env APPS_SCRIPT_URL_<SLUG>) no placeholder
#   4. copia logo + relatórios pra raiz web do tenant
#   5. adiciona DOMAIN -> pasta no nginx map ($host -> $tenant_root)
# `default` do map = transbyshop (catch-all seguro p/ produção).

TEMPLATE=/engine/pesquisa.template.html
CLIENTS_DIR=/clientes
WEBROOT=/usr/share/nginx/html
MAPFILE=/etc/nginx/conf.d/00-tenant-map.conf

# Lista EXPLÍCITA de tokens p/ envsubst. Não inclui APPS_SCRIPT_URL nem os
# template literals do JS (${nome}, ${encodeURIComponent...}) — esses ficam intactos.
VARS='${COMPANY_NAME} ${LOGO_FILE} ${HEADER_LOGO_FILTER} ${PRIMARY} ${PRIMARY_DARK} ${PRIMARY_GLOW} ${ACCENT} ${ACCENT2} ${BLUSH_LIGHT} ${BLUSH} ${BLUSH_MID} ${TEXT_MAIN} ${TEXT_MUTED} ${BORDER} ${BG} ${REQ_BG} ${SHADOW_RGB} ${HOVER_RGB} ${ARROW} ${HEADER_BG} ${HEADER_TEXT} ${HEADER_EYEBROW} ${HEADER_SUB} ${HEADER_SUB_STRONG} ${ON_PRIMARY} ${CTA_BG} ${CTA_TEXT} ${HERO_BG}'

CLIENT_VARS="DOMAIN COMPANY_NAME LOGO_FILE HEADER_LOGO_FILTER PRIMARY PRIMARY_DARK PRIMARY_GLOW ACCENT ACCENT2 BLUSH_LIGHT BLUSH BLUSH_MID TEXT_MAIN TEXT_MUTED BORDER BG REQ_BG SHADOW_RGB HOVER_RGB ARROW HEADER_BG HEADER_TEXT HEADER_EYEBROW HEADER_SUB HEADER_SUB_STRONG ON_PRIMARY CTA_BG CTA_TEXT HERO_BG"

echo "map \$host \$tenant_root {" >  "$MAPFILE"
echo "    default ${WEBROOT}/transbyshop;" >> "$MAPFILE"

for dir in "$CLIENTS_DIR"/*/; do
  [ -f "${dir}config.env" ] || continue
  slug=$(basename "$dir")

  # carrega config do cliente (exporta p/ envsubst)
  set -a
  # shellcheck disable=SC1090
  . "${dir}config.env"
  set +a

  # resolve URL do Apps Script: APPS_SCRIPT_URL_<SLUG_MAIUSCULO>
  slug_upper=$(echo "$slug" | tr '[:lower:]-' '[:upper:]_')
  url_var="APPS_SCRIPT_URL_${slug_upper}"
  eval "client_url=\${${url_var}:-}"

  out="${WEBROOT}/${slug}"
  mkdir -p "$out"

  # render: index.html próprio do cliente (override total = design individual)
  # OU template + config.env. Override é opt-in: só se o cliente tiver index.html.
  if [ -f "${dir}index.html" ]; then
    cp "${dir}index.html" "${out}/index.html"
  else
    envsubst "$VARS" < "$TEMPLATE" > "${out}/index.html"
  fi
  # injeta Apps Script URL (vale p/ template renderizado e p/ override)
  sed -i "s|__APPS_SCRIPT_URL__|${client_url}|g" "${out}/index.html"

  # logo do cliente
  [ -n "${LOGO_FILE:-}" ] && [ -f "${dir}${LOGO_FILE}" ] && cp "${dir}${LOGO_FILE}" "${out}/${LOGO_FILE}"

  # relatórios (HTML autocontidos)
  if [ -d "${dir}relatorios" ]; then
    find "${dir}relatorios" -maxdepth 1 -name '*.html' -exec cp {} "${out}/" \; 2>/dev/null || true
  fi

  # nginx map: domínio -> pasta (pula se DOMAIN vazio -> cai no default)
  if [ -n "${DOMAIN:-}" ]; then
    echo "    ${DOMAIN} ${out};" >> "$MAPFILE"
  fi

  if [ -n "$client_url" ]; then url_status="ok"; else url_status="!! SEM URL"; fi
  echo "  [tenant] ${slug}  domain=${DOMAIN:-<default>}  apps_script=${url_status}"

  # limpa vars do cliente p/ não vazar pro próximo
  # shellcheck disable=SC2086
  unset $CLIENT_VARS
done

echo "}" >> "$MAPFILE"

echo "── nginx tenant map ──"
cat "$MAPFILE"

exec nginx -g "daemon off;"
