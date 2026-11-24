# 📚 Biblioteca: Laravel + React

Aplicación para gestionar una biblioteca de libros: CRUD de libros y categorías, y filtrado por categoría.

| Capa | Tecnología |
| --- | --- |
| Backend | PHP 8.2+ · Laravel 12 · Eloquent · PostgreSQL · arquitectura **Repository → Service → Controller** |
| Frontend | React 19 · TypeScript · Vite · Redux Toolkit · Axios · **Motion** (estilos y animaciones) · SweetAlert2 · arquitectura **Screaming Architecture** |
| Infraestructura | Docker multi-stage (FrankenPHP / Nginx sin privilegios) · Docker Compose · GitHub Actions · Docker Hub |

> El enunciado original del reto está en [`docs/ENUNCIADO.md`](docs/ENUNCIADO.md).

---

## Índice

1. [Estructura del repositorio](#1-estructura-del-repositorio)
2. [Inicio rápido con Docker Compose](#2-inicio-rápido-con-docker-compose)
3. [Inicio local sin Docker](#3-inicio-local-sin-docker)
4. [API REST](#4-api-rest)
5. [Probar la API con REST Client](#5-probar-la-api-con-rest-client)
6. [Tests, lint y build](#6-tests-lint-y-build)
7. [Arquitectura](#7-arquitectura)
8. [CI/CD con GitHub Actions](#8-cicd-con-github-actions)

---

## 1. Estructura del repositorio

```text
books/
├── .github/workflows/
│   ├── ci.yml                  # Tests + lint + build + artifacts
│   └── docker-publish.yml      # Push a Docker Hub (versión + latest) cuando CI termina OK
├── backend/library/            # API Laravel
│   ├── app/
│   │   ├── Exceptions/         # Errores de dominio -> respuestas HTTP (404, 409)
│   │   ├── Http/Controllers/Api/
│   │   ├── Http/Requests/      # Form Requests (validaciones)
│   │   ├── Http/Resources/     # API Resources (formato JSON)
│   │   ├── Models/
│   │   ├── Repositories/       # Contracts/ (interfaces) + Eloquent/ (implementaciones)
│   │   └── Services/           # Lógica de negocio
│   ├── database/               # Migraciones, factories y seeders
│   ├── docker/                 # Caddyfile, php.ini y entrypoint del contenedor
│   ├── rest/                   # Archivos .http para la extensión REST Client
│   ├── tests/                  # Feature (API) + Unit (servicios)
│   └── Dockerfile
├── frontend/library/           # SPA React
│   ├── nginx/                  # Plantilla de Nginx (SPA + proxy /api)
│   ├── src/
│   │   ├── app/                # Store, providers y componente raíz
│   │   ├── books/              # Feature "libros"
│   │   ├── categories/         # Feature "categorías"
│   │   ├── shared/             # API client, tema, UI kit, utilidades
│   │   └── test/               # Setup y helpers de Vitest
│   └── Dockerfile
├── docker-compose.yml
├── .env.example                # Variables de docker-compose
└── VERSION                     # Versión base (MAJOR.MINOR) de las imágenes
```

---

## 2. Inicio rápido con Docker Compose

### Requisitos

- Docker Desktop (o Docker Engine) con Docker Compose v2.

### Pasos

```bash
# 1. (Opcional) Copia las variables de entorno. Todas tienen un valor por defecto.
cp .env.example .env

# 2. (Recomendado) Genera una APP_KEY y pégala en .env
php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
#   o, sin PHP instalado:
docker run --rm php:8.3-cli-alpine php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"

# 3. Construye y levanta todo
docker compose up -d --build

# 4. Comprueba el estado (los tres servicios deben salir "healthy")
docker compose ps
```

Al arrancar, el backend ejecuta las **migraciones** y los **seeders** automáticamente (`RUN_MIGRATIONS=true`, `RUN_SEEDERS=true`). Los seeders son idempotentes: puedes reiniciar sin duplicar datos.

### URLs

| Servicio | URL | Notas |
| --- | --- | --- |
| Frontend | <http://localhost:8081> | La SPA llama a `/api/*` y Nginx lo reenvía al backend |
| Backend (directo) | <http://localhost:8010/books> | Health check: <http://localhost:8010/up> |
| Backend (vía Nginx) | <http://localhost:8081/api/books> | |
| PostgreSQL | `localhost:5433` | usuario `postgres`, BD `library` |

> Los puertos del host se eligieron para no chocar con servicios locales habituales (un PostgreSQL local en 5432, `php artisan serve` en 8000, etc.). Puedes cambiarlos en `.env` con `FRONTEND_PORT`, `BACKEND_PORT` y `DB_FORWARD_PORT`.

### Variables de entorno (`.env` de la raíz)

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `APP_KEY` | *(vacío)* | Clave de Laravel. Si está vacía, el contenedor genera una efímera y lo avisa en los logs |
| `APP_ENV` / `APP_DEBUG` | `production` / `false` | Entorno de Laravel |
| `RUN_MIGRATIONS` / `RUN_SEEDERS` | `true` / `true` | Migraciones y seeders al arrancar el backend |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:8081,http://localhost:5173` | Orígenes permitidos (separados por comas, `*` para cualquiera) |
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | `library` / `postgres` / `postgres_secret` | Credenciales de PostgreSQL |
| `FRONTEND_PORT` / `BACKEND_PORT` / `DB_FORWARD_PORT` | `8081` / `8010` / `5433` | Puertos publicados en el host |
| `DOCKERHUB_NAMESPACE` / `IMAGE_TAG` | `library-local` / `latest` | Nombre y tag de las imágenes |

### Comandos útiles

```bash
docker compose logs -f backend                    # logs del backend
docker compose exec backend php artisan migrate:fresh --seed   # reiniciar la BD
docker compose exec db psql -U postgres -d library             # consola de PostgreSQL
docker compose down                               # parar
docker compose down -v                            # parar y BORRAR el volumen de la BD
```

### Usar las imágenes publicadas en Docker Hub

```bash
# En .env:
#   DOCKERHUB_NAMESPACE=<tu-usuario-de-docker-hub>
#   IMAGE_TAG=latest        # o una versión concreta, p. ej. 1.0.12
docker compose pull backend frontend
docker compose up -d --no-build
```

---

## 3. Inicio local sin Docker

### Requisitos

- PHP **8.2+** con las extensiones `pdo_pgsql`, `mbstring`, `openssl`, `fileinfo`, y Composer 2
- PostgreSQL 14+
- Node.js **20.19+** (recomendado 24) con Corepack (`pnpm` se instala solo, con la versión fijada en `package.json`)

### Backend

```bash
cd backend/library

composer install
cp .env.example .env          # ya viene configurado para pgsql
php artisan key:generate

# Ajusta DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME y DB_PASSWORD en .env
# y crea la base de datos si no existe:
#   createdb -U postgres library

php artisan migrate --seed    # tablas + datos de ejemplo
php artisan serve             # http://localhost:8000
```

> Si el puerto 8000 está ocupado (por ejemplo, por otro proyecto Laravel), usa `php artisan serve --port=8001` y ajusta `VITE_DEV_API_PROXY_TARGET` en el frontend.

### Frontend

```bash
cd frontend/library

corepack enable               # activa pnpm (versión fijada en package.json)
pnpm install
cp .env.example .env          # opcional
pnpm dev                      # http://localhost:5173
```

En desarrollo, Vite reenvía `/api/*` a `VITE_DEV_API_PROXY_TARGET` (por defecto `http://localhost:8000`), igual que Nginx en Docker. Así no hay problemas de CORS.

| Variable (frontend) | Por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | URL base de la API usada por Axios (se fija en tiempo de build) |
| `VITE_DEV_API_PROXY_TARGET` | `http://localhost:8000` | Solo `pnpm dev`: destino del proxy `/api` |

---

## 4. API REST

Todas las respuestas son JSON. Los listados vienen en `data`; las escrituras añaden un `message`.

### Libros

| Método | Ruta | Descripción | Respuestas |
| --- | --- | --- | --- |
| `GET` | `/books` | Lista todos los libros (con su categoría) | 200 |
| `GET` | `/books?category={category_id}` | Filtra por categoría | 200 · 422 si la categoría no existe |
| `GET` | `/books/{id}` | Detalle | 200 · 404 |
| `POST` | `/books` | Crea un libro | 201 · 422 |
| `PUT` | `/books/{id}` | Actualiza un libro | 200 · 404 · 422 |
| `DELETE` | `/books/{id}` | Elimina (verifica antes que exista) | 200 · 404 |

```json
{
  "title": "Cien años de soledad",
  "author": "Gabriel García Márquez",
  "description": "Opcional",
  "published_year": 1967,
  "category_id": 1
}
```

Validaciones: `title` obligatorio y de 3 caracteres como mínimo · `author` obligatorio · `published_year` obligatorio, entero entre 1000 y el año actual · `category_id` obligatorio y debe existir en `categories` · `description` opcional.

### Categorías

| Método | Ruta | Descripción | Respuestas |
| --- | --- | --- | --- |
| `GET` | `/categories` | Lista con `books_count` | 200 |
| `GET` | `/categories/{id}` | Detalle | 200 · 404 |
| `POST` | `/categories` | Crea (`name` obligatorio y **único**) | 201 · 422 |
| `PUT` | `/categories/{id}` | Renombra (`name` único) | 200 · 404 · 422 |
| `DELETE` | `/categories/{id}` | Elimina **solo si no tiene libros** | 200 · 404 · **409** |

### Errores

| Código | Cuándo | Cuerpo |
| --- | --- | --- |
| 404 | Recurso o ruta inexistente | `{ "message": "El libro con id 5 no existe." }` |
| 405 | Método no permitido | `{ "message": "..." }` |
| 409 | Categoría con libros asociados | `{ "message": "No se puede eliminar la categoría \"Novela\" porque tiene libros asociados." }` |
| 422 | Validación | `{ "message": "...", "errors": { "title": ["..."] } }` |

---

## 5. Probar la API con REST Client

La carpeta [`backend/library/rest/`](backend/library/rest) contiene `books.http` y `categories.http` para la extensión de VS Code **REST Client** (`humao.rest-client`).

1. Instala la extensión REST Client.
2. Abre `books.http` o `categories.http`.
3. Ajusta `@baseUrl` al principio del archivo:
   - `http://localhost:8010`: Docker, directo al backend (por defecto)
   - `http://localhost:8081/api`: Docker, a través de Nginx
   - `http://localhost:8000`: `php artisan serve`
4. Pulsa **Send Request** sobre cada petición. Las peticiones de crear guardan el `id` de la respuesta (`# @name`) y lo reutilizan en las de ver, editar y eliminar. También hay casos de error (422, 404 y 409).

---

## 6. Tests, lint y build

### Backend (`backend/library`)

```bash
composer install
php artisan test              # Feature (API) + Unit (servicios). Usa SQLite en memoria
vendor/bin/pint --test        # estilo de código (Laravel Pint)
vendor/bin/pint               # corrige el estilo
```

Para probar contra PostgreSQL, usa **una base de datos de test separada** (los tests usan `RefreshDatabase` y la vacían):

```bash
DB_CONNECTION=pgsql DB_DATABASE=library_test php artisan test
```

### Frontend (`frontend/library`)

```bash
pnpm lint                     # ESLint (0 warnings)
pnpm typecheck                # TypeScript
pnpm test                     # Vitest + Testing Library
pnpm test:coverage            # con cobertura (coverage/)
pnpm build                    # build de producción (dist/)
```

---

## 7. Arquitectura

### Backend: Repository → Service → Controller

```text
HTTP ─► Form Request (valida) ─► Controller ─► Service (reglas de negocio) ─► Repository (Eloquent) ─► BD
                                     │
                                     └─► API Resource (formato de la respuesta)
```

- **Repositories** (`app/Repositories`): solo acceso a datos. Los servicios dependen de las *interfaces* (`Contracts/`), que se enlazan a las implementaciones Eloquent en `RepositoryServiceProvider`.
- **Services** (`app/Services`): lógica de negocio. Por ejemplo, `BookService::delete()` comprueba que el libro exista antes de eliminarlo, y `CategoryService::delete()` impide borrar una categoría con libros.
- **Controllers** (`app/Http/Controllers/Api`): finos; solo coordinan request → service → resource.
- **Exceptions** (`app/Exceptions`): `ApiException` y sus subclases se renderizan solas como JSON con el código HTTP correcto.
- Las rutas están en la raíz (`/books`, `/categories`), como pide el enunciado (`apiPrefix: ''`).

### Frontend: Screaming Architecture + Redux

```text
src/
├── app/            store (configureStore), hooks tipados, AppProvider, App
├── books/          ── feature
│   ├── components/   BookCard, BookForm, BookFormModal, BookList, BooksToolbar, CategoryFilter...
│   ├── hooks/        useBooksStore.ts  (llamadas a la API /books)  ·  useBookForm.ts (estado del form)
│   ├── pages/        BooksPage
│   ├── slices/       bookSlice.ts
│   ├── types/        book.types.ts
│   └── utils/        bookForm.ts (validación + mapeos)
├── categories/     ── feature
│   ├── components/   CategoryForm, CategoryList, CategoryManagerModal
│   ├── hooks/        useCategoriesStore.ts  (llamadas a la API /categories)
│   ├── slices/       categorySlice.ts
│   └── types/
└── shared/         api (axios), components/ui (Button, Modal, Form...), theme, utils
```

- **Todas las llamadas a la API** están en los hooks `use<Api>Store.ts` (`useBooksStore`, `useCategoriesStore`). Cada acción actualiza el estado global de Redux siguiendo el patrón del enunciado: `onStartLoading…` → petición → `clear…` → `onLoad…` → `onLoadAllResponseOf…SinceBackend`; los errores se muestran con SweetAlert2.
- **Estilos solo con Motion**: no hay CSS, Tailwind ni Bootstrap. Cada componente usa `motion.*` con objetos de estilo (`*.styles.ts`) y los *tokens* de `shared/theme/theme.ts`. Los estados interactivos usan `whileHover`, `whileTap` y `whileFocus`, y las animaciones de entrada y salida, `AnimatePresence` y `layout`.
- Los componentes son pequeños y de una sola responsabilidad (no hay *god components*). El UI kit reutilizable está en `shared/components/ui`.

---

## 8. CI/CD con GitHub Actions

### `ci.yml`: en cada push o PR a `main`

| Job | Qué hace |
| --- | --- |
| `dockerfile-lint` (matrix: backend, frontend) | Hadolint sobre ambos Dockerfiles |
| `backend-lint` | `composer validate`, **Pint**, `composer audit` |
| `backend-tests` (matrix: PHP 8.2 / 8.3 / 8.4 + PostgreSQL) | `php artisan test` con SQLite y, en una variante, contra un contenedor de **PostgreSQL**. Sube los reportes JUnit y la cobertura como artifacts |
| `backend-build` | `composer install --no-dev` optimizado y empaquetado → artifact **`backend-build`** |
| `frontend-lint` | ESLint + TypeScript |
| `frontend-tests` | Vitest con cobertura → artifact `frontend-coverage` |
| `frontend-build` | `pnpm build` → artifact **`frontend-dist`** |

Cache: paquetes de Composer (`actions/cache`, clave `composer.lock`) y store de pnpm (`actions/setup-node` con `cache: pnpm`, clave `pnpm-lock.yaml`). Los builds solo se ejecutan si pasan lint y tests.

### `docker-publish.yml`: cuando `CI` termina **con éxito** en un push a `main`

1. Calcula la versión `MAJOR.MINOR.<run_number>` a partir del archivo [`VERSION`](VERSION) (p. ej. `1.0.7`).
2. Construye y publica (matrix: backend, frontend) con Buildx y cache de capas `type=gha`, más SBOM y provenance:
   - `<usuario>/books-backend:1.0.7`, `:1.0`, `:sha-abc1234`, **`:latest`**
   - `<usuario>/books-frontend:1.0.7`, `:1.0`, `:sha-abc1234`, **`:latest`**
3. Crea el tag `v1.0.7` y una **GitHub Release** con las notas generadas.

No despliega en ningún sitio. Para subir de versión mayor o menor, edita `VERSION`.

### Configuración necesaria en GitHub

En *Settings → Secrets and variables → Actions*:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| Variable | `DOCKERHUB_USERNAME` | Tu usuario/organización de Docker Hub |
| Secret | `DOCKERHUB_TOKEN` | Un *Personal Access Token* de Docker Hub con permiso **Read & Write** |

Y en Docker Hub, dos repositorios públicos: **`books-backend`** y **`books-frontend`**.
