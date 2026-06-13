FROM nginx:alpine

# Motor (template) + clientes (config/logo/relatorios) + server nginx
COPY engine/                    /engine/
COPY clientes/                  /clientes/
COPY engine/nginx.conf.template /etc/nginx/conf.d/default.conf

# Entrypoint multi-tenant: renderiza um index.html por cliente e gera o map de domínios
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
