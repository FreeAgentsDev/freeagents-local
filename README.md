# FreeAgents Local — Sistema de clientes

Catálogo público, registro y portal de clientes de FreeAgents Local. Es un
sistema independiente del CRM interno: corre con **Next.js + PostgreSQL** y
nada más, para poder desplegarlo en Railway, un VPS o cualquier plataforma de
contenedores sin quedar atado a un proveedor.

## Flujo del cliente

1. **`/catalogo`** — arma su solución por piezas (negocio → objetivo → solución → inversión → impacto).
2. **`/register`** — crea su cuenta; el paquete armado viaja como snapshot.
3. **`/portal`** — ve sus productos, el estado de activación de cada uno y su inversión.

## Stack

- **Next.js 16** (App Router, server actions, `proxy.ts` para proteger `/portal`)
- **PostgreSQL + Drizzle ORM** (migraciones en `drizzle/`)
- **Better Auth** (email + contraseña, sesiones en Postgres)
- **Tailwind CSS 4 + shadcn/ui**

## Arquitectura plug-and-play de productos

Cada producto (SKU) vive en `lib/products/modules/*` y cumple el contrato
`ProductModule` (`lib/products/types.ts`):

- `product` — metadata: nombre, categoría, tipo de aprovisionamiento y checklist de onboarding.
- `provision()` — se ejecuta al crear el entitlement y devuelve el estado inicial.

Al registrarse un cliente, cada solución del snapshot se convierte en un
**entitlement** (`entitlements`) con su checklist (`onboarding_items`). El
portal se construye leyendo entitlements, así que agregar un producto nuevo es
crear un módulo y registrarlo en `lib/products/registry.ts`.

Los SKUs son 1:1 con las soluciones del catálogo (`lib/local-catalog/`), por lo
que una cotización se traduce directamente a productos activables.

## Desarrollo

```bash
cp .env.example .env   # ajusta DATABASE_URL y AUTH_SECRET
npm install
npm run db:migrate     # aplica migraciones
npm run dev
```

Con Docker (app + Postgres):

```bash
AUTH_SECRET=$(openssl rand -base64 32) docker compose up --build
```

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Conexión Postgres |
| `AUTH_SECRET` | Secreto de sesiones (`openssl rand -base64 32`) |
| `APP_URL` | URL pública de la app (`https://local.freeagentsdev.com` en producción) |
| `CRM_WEBHOOK_URL` | (Opcional) endpoint del CRM para leads/registros |
| `CRM_WEBHOOK_SECRET` | (Opcional) secreto compartido del webhook |

## Dominio y Vercel

El apex **`freeagentsdev.com`** sigue en la landing. Este sistema usa el subdominio:

**https://local.freeagentsdev.com**

### 1. Proyecto en Vercel

Importa `FreeAgentsDev/freeagents-local`. En Environment Variables (Production):

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | Postgres de producción (Neon, Railway, etc.) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `APP_URL` | `https://local.freeagentsdev.com` |

Vercel no incluye Postgres. Crea una base (Neon es la opción más liviana) y corre `npm run db:migrate` contra esa URL antes de abrir el portal.

### 2. Dominio en Vercel

En el proyecto: **Settings → Domains → Add** → `local.freeagentsdev.com`.

### 3. DNS en Namecheap

En el dominio `freeagentsdev.com` (Advanced DNS), **no toques** los records del apex que ya usa la landing. Agrega solo:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `local` | `cname.vercel-dns.com.` | Automatic |

Si Namecheap pide un target sin punto final, usa `cname.vercel-dns.com`.

Cuando Vercel marque el dominio como *Valid*, catálogo = `https://local.freeagentsdev.com/catalogo` y portal = `https://local.freeagentsdev.com/portal`. La landing de producción ya apunta a ese host.

## Scripts

- `npm run db:generate` — genera migraciones desde `lib/db/schema.ts`
- `npm run db:migrate` — aplica migraciones
- `npm run typecheck` / `npm run lint`
