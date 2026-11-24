#!/bin/sh
set -e

log() {
    echo "[entrypoint] $*" >&2
}

# APP_KEY must be injected as an environment variable. The API is stateless
# (no sessions / cookies), so an ephemeral key is acceptable as a fallback.
if [ -z "${APP_KEY}" ]; then
    log "WARNING: APP_KEY is not set. Generating an ephemeral key for this container."
    APP_KEY="base64:$(php -r 'echo base64_encode(random_bytes(32));')"
    export APP_KEY
fi

# Clear stale caches and cache config/routes/events with the current env vars.
php artisan optimize:clear >/dev/null
php artisan config:cache
php artisan route:cache
php artisan event:cache

if [ "${RUN_MIGRATIONS}" = "true" ]; then
    log "Running migrations..."
    # Retry: the database may still be starting.
    attempts=0
    until php artisan migrate --force --no-interaction; do
        attempts=$((attempts + 1))
        if [ "${attempts}" -ge 10 ]; then
            log "Migrations failed after ${attempts} attempts."
            exit 1
        fi
        log "Database not ready, retrying in 3s (${attempts}/10)..."
        sleep 3
    done
fi

if [ "${RUN_SEEDERS}" = "true" ]; then
    log "Running seeders (idempotent)..."
    php artisan db:seed --force --no-interaction
fi

exec "$@"
