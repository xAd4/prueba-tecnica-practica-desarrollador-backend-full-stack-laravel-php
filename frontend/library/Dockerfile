# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24
ARG NGINX_VERSION=1.29

# ---------------------------------------------------------------------------
# 1) base: Node + pnpm (version pinned by "packageManager" in package.json)
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    CI=true
RUN corepack enable
WORKDIR /app

# ---------------------------------------------------------------------------
# 2) deps: install dependencies only (cached while the lockfile doesn't change)
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# ---------------------------------------------------------------------------
# 3) build: type-check + production bundle
# ---------------------------------------------------------------------------
FROM deps AS build
COPY . .
# Base URL used by the SPA to reach the API. "/api" is proxied by Nginx.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm run build

# ---------------------------------------------------------------------------
# 4) runtime: unprivileged Nginx serving the static files + reverse proxy
# ---------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}-alpine AS runtime

ARG APP_VERSION=dev
LABEL org.opencontainers.image.title="books-frontend" \
      org.opencontainers.image.description="React + Redux frontend for the Library app" \
      org.opencontainers.image.version="${APP_VERSION}"

# Where Nginx forwards /api/* (envsubst renders the template on start-up).
ENV BACKEND_URL=http://backend:8000 \
    NGINX_ENVSUBST_FILTER=^BACKEND_

COPY --chown=nginx:nginx nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# 101 = nginx user of the unprivileged image
USER 101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["wget", "-q", "--spider", "http://127.0.0.1:8080/healthz"]
