FROM nginx:alpine

# Pesquisa (formulário CSAT — recebe a env var APPS_SCRIPT_URL via entrypoint)
COPY pesquisa-transbyshop.html /usr/share/nginx/html/index.html
COPY logo-1.svg /usr/share/nginx/html/logo-1.svg

# Relatórios executivos (HTML autocontido — sem dependência externa)
COPY relatorios/ /usr/share/nginx/html/

# Script de entrypoint que injeta a env var antes de subir o nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
