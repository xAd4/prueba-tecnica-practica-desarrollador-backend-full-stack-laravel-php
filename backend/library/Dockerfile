# syntax=docker/dockerfile:1.7

ARG PHP_VERSION=8.3

# ---------------------------------------------------------------------------
# 1) base: FrankenPHP (Caddy + PHP) with the extensions Laravel needs
# ---------------------------------------------------------------------------
FROM dunglas/frankenphp:1-php${PHP_VERSION}-alpine AS base

RUN install-php-extensions pdo_pgsql opcache \
    && cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY docker/php/conf.d/app.ini "$PHP_INI_DIR/conf.d/zz-app.ini"
WORKDIR /app

# ---------------------------------------------------------------------------
# 2) vendor: production Composer dependencies (no dev packages)
# ---------------------------------------------------------------------------
FROM base AS vendor

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_CACHE_DIR=/tmp/composer-cache

# Install dependencies first so this layer is cached while composer.* don't change.
COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/tmp/composer-cache \
    composer install --no-dev --no-interaction --no-progress --prefer-dist \
        --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative --no-scripts \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views \
        storage/logs bootstrap/cache \
    && php artisan package:discover --ansi

# ---------------------------------------------------------------------------
# 3) runtime: minimal image, non-root user
# ---------------------------------------------------------------------------
FROM base AS runtime

ARG APP_VERSION=dev
ARG UID=1000
ARG GID=1000

LABEL org.opencontainers.image.title="books-backend" \
      org.opencontainers.image.description="Laravel REST API for the Library app" \
      org.opencontainers.image.version="${APP_VERSION}"

ENV APP_ENV=production \
    APP_DEBUG=false \
    APP_VERSION=${APP_VERSION} \
    LOG_CHANNEL=stderr \
    LOG_LEVEL=info \
    SESSION_DRIVER=array \
    CACHE_STORE=file \
    QUEUE_CONNECTION=sync \
    SERVER_PORT=8000 \
    RUN_MIGRATIONS=false \
    RUN_SEEDERS=false \
    XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

RUN addgroup -g ${GID} app \
    && adduser -D -u ${UID} -G app app \
    && chown -R app:app /config /data

COPY --chown=app:app docker/frankenphp/Caddyfile /etc/caddy/Caddyfile
COPY --chown=app:app --chmod=755 docker/entrypoint.sh /usr/local/bin/docker-entrypoint
COPY --from=vendor --chown=app:app /app /app

USER ${UID}:${GID}
EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
    CMD ["php", "-r", "exit(@file_get_contents('http://127.0.0.1:' . getenv('SERVER_PORT') . '/up') === false ? 1 : 0);"]

ENTRYPOINT ["docker-entrypoint"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
