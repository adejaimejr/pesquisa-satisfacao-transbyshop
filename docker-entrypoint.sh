#!/bin/sh
set -e

# Substitui o placeholder __APPS_SCRIPT_URL__ pelo valor da variável de ambiente
sed -i "s|__APPS_SCRIPT_URL__|${APPS_SCRIPT_URL}|g" /usr/share/nginx/html/index.html

# Inicia o nginx
exec nginx -g "daemon off;"
