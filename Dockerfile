FROM nginx:alpine

# Copia os arquivos estáticos
COPY pesquisa-transbyshop.html /usr/share/nginx/html/index.html
COPY logo-1.svg /usr/share/nginx/html/logo-1.svg

# Script de entrypoint que injeta a env var antes de subir o nginx
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
