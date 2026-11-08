# Entrega 1 - Docker e Integración Continua

## Descripción
Proyecto de ejemplo con dos contenedores Docker comunicados:
- `app`: API Node.js/Express.
- `db`: base de datos PostgreSQL.

## Arquitectura
La API se conecta a PostgreSQL usando el host `db` dentro de la red `app_net`.

## Ejecución
1. Copiar el archivo de variables de entorno:
   ```bash
   cp .env.example .env
