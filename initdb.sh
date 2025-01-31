#!/bin/sh

# Remplacer les valeurs des secrets dans initdb.sql
sed -i "s/USERNAME_PLACEHOLDER/$DB_APP_USERNAME/g" /docker-entrypoint-initdb.d/initdb.sql
sed -i "s/PASSWORD_PLACEHOLDER/$DB_APP_PASSWORD/g" /docker-entrypoint-initdb.d/initdb.sql

# Exécuter le script SQL
exec "$@"