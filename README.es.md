<h1 align="center">🏢 Enterprise B2B Automation Hub</h1>

<p align="center">
  <strong>MVP Full-stack · Express + Next.js 14 + PostgreSQL · TypeScript</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24.13-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## 📋 Descripción General

Un **Enterprise B2B Automation Hub** universal — un único repositorio MVP full-stack diseñado para demostrar patrones de nivel productivo en tres dominios críticos:

| Dominio | Problema | Solución |
|---------|----------|----------|
| 🇮🇳 Webhooks Meta/WhatsApp | Verificación handshake e ingesta de payloads complejos | Endpoint verificado con validación Zod y escrituras atómicas en PostgreSQL |
| 🇺🇸 Ledger Offline-First PWA | Ingreso de datos sin conectividad | Cola IndexedDB + motor de sincronización Service Worker |
| 🏥 Catálogo de Propiedades Médicas | Filtrado por rangos numéricos a escala | Constructor SQL personalizado con sentencias preparadas |

### ✨ ¿Por Qué Este Proyecto?

En lugar de construir tres proyectos separados, este repositorio cubre **tres módulos probados para portafolio** que los gerentes de contratación en empresas B2B SaaS, startups health-tech y agencias de marketing quieren ver. Cada ruta está reforzada con:

- ✅ **TypeScript estricto** de punta a punta
- ✅ **Validación Zod** en tiempo de ejecución
- ✅ **Consultas SQL parametrizadas** (sin inyección)
- ✅ **Transacciones atómicas**
- ✅ **Fallback offline sin dependencias** (IndexedDB puro)
- ✅ **Manejo de errores de nivel productivo**
- ✅ **Autenticación JWT** con rotación de tokens access/refresh
- ✅ **Control de acceso basado en roles** (admin, manager, viewer)
- ✅ **Rate limiting** por endpoint (global, auth, webhook, sync)
- ✅ **Verificación de firma HMAC-SHA256** en webhooks
- ✅ **37 pruebas de integración Jest** cubriendo todas las rutas
- ✅ **12 pruebas E2E Playwright** cubriendo todos los flujos de usuario

---

## 🏛 Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 14)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Dashboard │  │ Webhook  │  │  Ledger Offline      │  │
│  │   Page    │  │  Tester  │  │  (IndexedDB + SW)    │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Búsqueda Propiedades (Constructor SQL Filters)  │  │
│  └──────────────────────────────────────────────────┘  │
│                         │ proxy                         │
│                 ┌───────┴───────┐                       │
│                 │ Next.js API   │                       │
│                 │   Rewrites    │                       │
│                 └───────┬───────┘                       │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP
┌─────────────────────────┼───────────────────────────────┐
│              Backend (Express + TypeScript)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Webhooks │  │   Sync   │  │ Properties/Search    │  │
│  │  Router  │  │ Endpoint │  │ (SQL Builder)        │  │
│  ├──────────┤  ├──────────┤  ├──────────────────────┤  │
│  │  Zod     │  │  Batch   │  │ Consultas BETWEEN    │  │
│  │ Validación│  │ Insert   │  │ Parametrizadas       │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       └──────────────┴──────────────────┘               │
│                         │ pg                            │
│                 ┌───────┴───────┐                       │
│                 │  PostgreSQL   │                       │
│                 │  (Supabase)   │                       │
│                 └───────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Por Qué |
|------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR, enrutamiento por archivos, React Server Components |
| **Estilos** | Tailwind CSS 3.4 + shadcn/ui | Tema B2B oscuro, utility-first, CSS zero-runtime |
| **Backend** | Express 4.18 + TypeScript | Más solicitado en contratos freelance, liviano |
| **Validación** | Zod 3.23 | Seguridad de tipos en runtime, formato automático de errores |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | Rotación de tokens access/refresh, cookies http-only |
| **RBAC** | Middleware personalizado | 3 roles: admin, manager, viewer |
| **Rate Limiting** | express-rate-limit | Por endpoint: global 100/min, auth 10/min, webhook 30/min, sync 60/min |
| **Seguridad Webhook** | HMAC-SHA256 | Firma de timestamp + payload, comparación timing-safe |
| **Base de datos** | PostgreSQL 16 (vía `pg`) | CTEs, JSONB, funciones ventana, columnas array |
| **Offline** | IndexedDB + Service Worker | APIs nativas del navegador, cero dependencias |
| **Pruebas Integ.** | Jest 30 + Supertest | 37 pruebas en health, auth, webhooks, sync, properties |
| **Pruebas E2E** | Playwright | 12 pruebas en dashboard, auth, webhook, ledger, properties |

---

## 🧩 Módulos

### Módulo 1: Webhook Router — `/api/webhooks`

**Simula el handshake y procesamiento de payloads de la API WhatsApp Business de Meta.**

```http
# Verificación (GET)
GET /api/webhooks?hub.mode=subscribe&hub.verify_token=supersecret_token_123&hub.challenge=CHALLENGE_ACCEPTED

# Ingesta de eventos (POST)
POST /api/webhooks
Authorization: Bearer supersecret_token_123
Content-Type: application/json

{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "123456789",
    "changes": [{
      "value": {
        "metadata": { "display_phone_number": "15551234567", "phone_number_id": "987654321" },
        "contacts": [{ "profile": { "name": "John Doe" }, "wa_id": "15559876543" }],
        "messages": [{
          "from": "15559876543",
          "id": "wamid.ABC123",
          "timestamp": "1710000000",
          "type": "text",
          "text": { "body": "¡Interesado en sus servicios!" }
        }]
      },
      "field": "messages"
    }]
  }]
}
```

**Lo que demuestra:**
- Handshake tipo SHA256 (`hub.verify_token`)
- Parseo de JSON profundamente anidado con Zod
- `INSERT` atómico en PostgreSQL con payload JSONB
- Soporte para mensajes `text`, `button_reply` y `nfm_reply`
- Simulador frontend: pega cualquier payload, configura token, inspecciona eventos almacenados

---

### Módulo 2: Ledger Offline-First — `/api/sync`

**Sistema de entradas de ledger que funciona con o sin conexión a internet.**

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│ Usuario  │────▶│  POST /sync  │◀───▶│  Service Worker │
│ Formulario│    │  (online)    │     │  (cola offline) │
└──────────┘     └──────┬───────┘     └────────┬────────┘
                        │                      │
                   ┌────▼────┐           ┌─────▼─────┐
                   │PostgreSQL│           │ IndexedDB │
                   │ ledger   │           │ pending   │
                   │_entries  │           │ -sync     │
                   └─────────┘           └───────────┘
```

**Flujo:**
1. Usuario envía formulario → frontend intenta `POST /api/sync`
2. **Si está en línea:** datos escritos directamente en PostgreSQL
3. **Si está offline:** datos persistidos en IndexedDB (almacén `pending-sync`)
4. Service Worker escucha evento `online` → lee IndexedDB → batch `POST /api/sync` → limpia cola → despacha `SYNC_COMPLETE`
5. UI se actualiza vía evento personalizado `sync-complete`

**Lo que demuestra:**
- Ciclo de vida de Service Worker (install, activate, fetch interception, paso de mensajes)
- Operaciones CRUD con IndexedDB puro (sin librerías)
- Detección online/offline con indicadores visuales
- Transacciones batch con PostgreSQL `BEGIN/COMMIT`
- Sincronización libre de conflictos con timestamps `client_created_at`

---

### Módulo 3: Relational Filter Index — `/api/properties/search`

**Constructor SQL personalizado para catálogos de propiedades médicas/comerciales.**

```sql
SELECT id, name, square_footage, bedrooms, bathrooms, price,
       location_city, location_state
FROM properties
WHERE property_type = $1
  AND square_footage BETWEEN $2 AND $3   -- 🔥 Rango personalizado
  AND price         BETWEEN $4 AND $5
  AND bedrooms      >= $6
  AND location_state = $7
ORDER BY price DESC
LIMIT 20 OFFSET 0;
```

**Filtros soportados:**

| Parámetro | Tipo | Ejemplo | SQL |
|-----------|------|---------|-----|
| `property_type` | string | `medical` | `= $1` |
| `min_square_footage` | number | `5000` | `>= $2` |
| `max_square_footage` | number | `50000` | `<= $3` |
| `min_price` | number | `1000000` | `>= $4` |
| `max_price` | number | `15000000` | `<= $5` |
| `min_bedrooms` | number | `2` | `>= $6` |
| `max_bedrooms` | number | `10` | `<= $7` |
| `min_bathrooms` | number | `1` | `>= $8` |
| `max_bathrooms` | number | `8` | `<= $9` |
| `location_state` | string | `CA` | `= $10` |
| `location_city` | string | `Miami` | `ILIKE $11` |
| `sort_by` | string | `price` | `ORDER BY` (whitelist) |
| `sort_order` | asc/desc | `desc` | `ASC/DESC` |

**Lo que demuestra:**
- Construcción dinámica de consultas SQL con **sentencias parametrizadas** (sin inyección)
- Indexación dinámica de parámetros `$N`
- Lista blanca de columnas para `ORDER BY` (previene inyección SQL en cláusula sort)
- Paginación `COUNT(*)` con `LIMIT/OFFSET`
- Columnas indexadas (`idx_properties_price`, `idx_properties_square_footage`)
- Datos semilla: 10 propiedades en 4 tipos (medical, residential, motel, commercial)

---

## 🛡 Capa de Seguridad

### 1. Autenticación JWT — `/api/auth`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/register` | POST | Crear cuenta (rol por defecto: `viewer`) |
| `/api/auth/login` | POST | Recibir access token + refresh cookie http-only |
| `/api/auth/refresh` | POST | Rotar tokens usando cookie http-only |
| `/api/auth/logout` | POST | Invalidar refresh token |
| `/api/auth/me` | GET | Obtener perfil de usuario actual (requiere Bearer token) |

**Flujo de tokens:**

```
┌──────────┐  POST /login   ┌──────────────┐
│  Cliente │ ──────────────▶│   Express    │
│          │◀────────────── │              │
│          │  { accessToken │  Validar     │
│          │    + Set-Cookie│  credenciales│
│          │    refresh_    │              │
│          │    token }     │  Generar     │
│          │                │  access(15m) │
│          │  GET /me       │  refresh(7d) │
│          │  Authorization:│              │
│          │  Bearer <token>│  Verificar   │
│          │◀────────────── │  JWT + RBAC  │
└──────────┘                └──────────────┘
```

**Usuarios semilla** (creados por migración):
| Email | Contraseña | Rol |
|-------|-----------|------|
| `admin@b2bhub.com` | `Admin123!` | `admin` |
| `manager@b2bhub.com` | `Manager123!` | `manager` |

### 2. Control de Acceso Basado en Roles (RBAC)

Tres roles con middleware granular:

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso completo a todas las rutas y datos |
| **manager** | Lectura/escritura en módulos, sin gestión de usuarios |
| **viewer** | Acceso de solo lectura a paneles y búsqueda |

Uso en rutas:
```typescript
import { authenticate, authorize } from '../middleware/auth';

router.get('/admin', authenticate, authorize('admin'), handler);
router.post('/data', authenticate, authorize('admin', 'manager'), handler);
router.get('/search', authenticate, handler); // cualquier usuario autenticado
```

### 3. Rate Limiting

| Limitador | Ventana | Máx. Solicitudes | Aplicado A |
|-----------|---------|-----------------|------------|
| **Global** | 1 minuto | 100 | Cada endpoint |
| **Auth** | 1 minuto | 10 | `/api/auth/*` |
| **Webhook** | 1 minuto | 30 | `/api/webhooks` |
| **Sync** | 1 minuto | 60 | `/api/sync` |

Todos los limitadores devuelven `429 Too Many Requests` con un cuerpo JSON de error cuando se exceden.

### 4. Verificación de Firma HMAC-SHA256 en Webhooks

Cada `POST` de webhook entrante debe incluir:

| Header | Formato | Ejemplo |
|--------|---------|---------|
| `x-webhook-signature` | `sha256=<hex>` | `sha256=a1b2c3...` |
| `x-webhook-timestamp` | Segundos Unix | `1710000000` |

**Proceso de verificación:**
1. El servidor lee `x-webhook-timestamp` y rechaza si tiene más de 5 minutos
2. Calcula `HMAC-SHA256(webhookSecret, "${timestamp}.${rawBody}")`
3. Compara usando `crypto.timingSafeEqual()` (seguro contra timing attacks)
4. Rechaza con `401` si la firma no coincide

---

## 🚀 Inicio Rápido

### Requisitos

- **Node.js** ≥ 20 (v24.13.1 recomendado)
- **PostgreSQL** ≥ 14 (o cuenta Supabase)
- **npm** ≥ 10

### Instalación

```bash
# Clonar el repositorio
git clone <tu-url-del-repo>
cd enterprise-b2b-automation-hub

# Instalar dependencias
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Configurar entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tu cadena de conexión PostgreSQL

# Ejecutar migraciones de base de datos
cd backend && npx tsx src/db/migrate.ts && cd ..

# Iniciar ambos servidores (o usar dos terminales)
npm run dev
```

El script de migración crea tres tablas (`webhook_events`, `ledger_entries`, `properties`) e inserta **10 propiedades de ejemplo** en tipos medical, residential, motel y commercial con datos realistas.

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3001` | Puerto del servidor backend |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/b2b_hub` | Conexión PostgreSQL |
| `TEST_DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/b2b_hub_test` | Conexión BD de pruebas |
| `WEBHOOK_VERIFY_TOKEN` | `supersecret_token_123` | Token para handshake webhook |
| `WEBHOOK_SECRET` | `whsec_your_webhook_secret_here` | Secreto de firma HMAC-SHA256 |
| `CORS_ORIGIN` | `http://localhost:3000` | Origen frontend permitido |
| `JWT_ACCESS_SECRET` | `access-secret-change-in-production-abc123` | Clave de firma de access token |
| `JWT_REFRESH_SECRET` | `refresh-secret-change-in-production-xyz789` | Clave de firma de refresh token |

---

## 📡 Referencia de API

### `POST /api/auth/register`

Crear una nueva cuenta de usuario.

```json
{ "email": "user@example.com", "password": "StrongPass123!", "name": "John Doe" }
```

**Respuesta:** `201`
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe", "role": "viewer" },
  "accessToken": "eyJhbGci..."
}
```

**Respuesta:** `409` — email ya registrado

---

### `POST /api/auth/login`

Autenticarse y recibir tokens.

```json
{ "email": "admin@b2bhub.com", "password": "Admin123!" }
```

**Respuesta:** `200`
```json
{
  "user": { "id": "uuid", "email": "admin@b2bhub.com", "name": "Admin User", "role": "admin" },
  "accessToken": "eyJhbGci..."
}
```
**Cookies:** Establece `refresh_token` (http-only, secure, sameSite=strict, 7d)

**Respuesta:** `401` — credenciales inválidas  
**Respuesta:** `403` — cuenta deshabilitada

---

### `POST /api/auth/refresh`

Rotar access token usando la refresh cookie http-only.

**Respuesta:** `200`
```json
{ "accessToken": "eyJhbGci..." }
```
**Respuesta:** `401` — refresh token faltante o expirado

---

### `POST /api/auth/logout`

Invalidar el refresh token actual.

**Respuesta:** `200`
```json
{ "status": "logged_out" }
```

---

### `GET /api/auth/me`

Obtener perfil del usuario autenticado actual.

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Respuesta:** `200`
```json
{ "user": { "id": "uuid", "email": "admin@b2bhub.com", "name": "Admin User", "role": "admin" } }
```

---

### `GET /api/health`

Endpoint de verificación de salud.

**Respuesta:** `200`
```json
{ "status": "healthy", "timestamp": "2026-06-16T12:00:00.000Z" }
```

---

### `GET /api/webhooks`

Handshake de verificación webhook de WhatsApp Business API.

| Parámetro Query | Valor |
|----------------|-------|
| `hub.mode` | `subscribe` |
| `hub.verify_token` | Debe coincidir con `WEBHOOK_VERIFY_TOKEN` |
| `hub.challenge` | Se devuelve en éxito |

**Respuesta:** `200` — devuelve el valor de `hub.challenge`  
**Respuesta:** `403` — si el token no coincide

---

### `POST /api/webhooks`

Ingerir un evento de WhatsApp Business API.

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer <WEBHOOK_VERIFY_TOKEN>` |
| `Content-Type` | `application/json` |

**Respuesta:** `200`
```json
{ "status": "ok" }
```

**Validación:** El esquema Zod valida la estructura `whatsapp_business_account`. Payloads inválidos devuelven `400` con detalles de error por campo.

---

### `GET /api/webhooks/events`

Recuperar eventos webhook almacenados (últimos 50).

**Respuesta:** `200` — array de objetos de evento con `id`, `source`, `event_type`, `payload`, `created_at`.

---

### `POST /api/sync`

Sincronización batch de entradas offline (máx. 100 por solicitud).

```json
{
  "entries": [
    {
      "client_id": "client_001",
      "amount": 1500.00,
      "currency": "USD",
      "description": "Honorarios consulta",
      "client_created_at": "2026-06-16T10:00:00.000Z"
    }
  ]
}
```

**Respuesta:** `201`
```json
{ "status": "synced", "count": 1, "ids": ["uuid-here"] }
```

---

### `GET /api/ledger`

Recuperar todas las entradas de ledger sincronizadas (últimas 100).

---

### `GET /api/properties/search`

Buscar propiedades con filtros dinámicos.

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `property_type` | No | Filtrar por tipo |
| `min_square_footage` | No | Metraje cuadrado mínimo |
| `max_square_footage` | No | Metraje cuadrado máximo |
| `min_price` | No | Precio mínimo |
| `max_price` | No | Precio máximo |
| `min_bedrooms` | No | Habitaciones mínimas |
| `max_bedrooms` | No | Habitaciones máximas |
| `location_state` | No | Código de estado de dos letras |
| `location_city` | No | Nombre de ciudad (coincidencia parcial insensible a mayúsculas) |
| `sort_by` | No | `price`, `square_footage`, `bedrooms`, `bathrooms`, `name`, `created_at` |
| `sort_order` | No | `asc` o `desc` |
| `limit` | No | Máx. 100 (default 20) |
| `offset` | No | Desplazamiento de paginación |

**Respuesta:** `200`
```json
{
  "data": [ { "id": "...", "name": "Sunset Medical Tower", "property_type": "medical", ... } ],
  "pagination": { "total": 3, "limit": 20, "offset": 0, "returned": 3 }
}
```

---

## 🧪 Pruebas

### Pruebas de Integración Backend (Jest + Supertest)

37 pruebas cubriendo cada ruta y caso extremo:

| Archivo | Pruebas | Cobertura |
|---------|---------|-----------|
| `health.test.ts` | 2 | código de estado, content-type, formato timestamp |
| `auth.test.ts` | 9 | registro, email duplicado, login, contraseña incorrecta, me, refresh, logout, validación token |
| `webhooks.test.ts` | 7 | handshake éxito/fallo, ingesta eventos, auth, verificación firma, validación Zod |
| `sync.test.ts` | 6 | entrada única, batch, array vacío, monto negativo, campos faltantes, validación esquema |
| `properties.test.ts` | 11 | filtro tipo, BETWEEN sqft, BETWEEN precio, filtro estado, ordenamiento, paginación, combinados, sin resultados, protección SQL injection |
| `rate-limit.test.ts` | 2 | solicitudes bajo límite pasan correctamente |

```bash
# Ejecutar todas las pruebas de integración (requiere PostgreSQL)
cd backend && npm test
```

**Base de datos de pruebas:** Usa la variable `TEST_DATABASE_URL` (por defecto `b2b_hub_test`). Las tablas se crean mediante migraciones antes de las pruebas y se limpian después.

### Pruebas E2E (Playwright)

12 pruebas cubriendo todos los flujos de usuario:

| Archivo | Pruebas | Flujo |
|---------|---------|-------|
| `auth.spec.ts` | 4 | Login renderiza, login válido redirige, error credenciales, alternar registro |
| `dashboard.spec.ts` | 3 | Dashboard carga, estado salud API visible, navegación por tarjetas |
| `webhooks.spec.ts` | 2 | Página renderiza, puede enviar webhook de prueba |
| `ledger.spec.ts` | 3 | Página renderiza, agregar entrada, indicador online/offline |
| `properties.spec.ts` | 5 | Búsqueda renderiza, filtro tipo, rango sqft, reset filtros, filas tabla visibles |

```bash
# Ejecutar pruebas E2E (inicia backend + frontend automáticamente)
npx playwright test

# Con modo UI
npx playwright test --ui
```

### Pruebas Manuales con Curl

```bash
# Iniciar backend
cd backend && npm run dev

# Registrar nuevo usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"StrongPass123!","name":"Test"}'

# Iniciar sesión
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@b2bhub.com","password":"Admin123!"}'

# Probar verificación webhook
curl "http://localhost:3001/api/webhooks?hub.mode=subscribe&hub.verify_token=supersecret_token_123&hub.challenge=test123"

# Probar ingesta de evento webhook (con firma HMAC)
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "$TIMESTAMP.{\"object\":\"whatsapp_business_account\",\"entry\":[{\"id\":\"1\",\"changes\":[{\"value\":{\"messages\":[{\"from\":\"15551234567\",\"id\":\"msg1\",\"timestamp\":\"1710000000\",\"type\":\"text\",\"text\":{\"body\":\"Hello\"}}]},\"field\":\"messages\"}]}]}" | openssl dgst -sha256 -hmac "whsec_your_webhook_secret_here" | sed 's/^.* //')
curl -X POST http://localhost:3001/api/webhooks \
  -H "Authorization: Bearer supersecret_token_123" \
  -H "x-webhook-signature: sha256=$SIGNATURE" \
  -H "x-webhook-timestamp: $TIMESTAMP" \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"id":"1","changes":[{"value":{"messages":[{"from":"15551234567","id":"msg1","timestamp":"1710000000","type":"text","text":{"body":"Hello"}}]},"field":"messages"}]}]}'

# Probar búsqueda de propiedades
curl "http://localhost:3001/api/properties/search?property_type=medical&min_square_footage=10000&max_price=10000000&sort_by=square_footage&sort_order=desc"

# Probar salud
curl http://localhost:3001/api/health
```

---

## 📁 Estructura del Proyecto

```
enterprise-b2b-automation-hub/
│
├── backend/                              # Express + TypeScript API
│   ├── src/
│   │   ├── index.ts                      # Entry del servidor, CORS, routing, rate limit
│   │   ├── config.ts                     # Config. entorno (JWT, rate limit, webhook)
│   │   ├── __tests__/                    # Pruebas Jest (37 tests)
│   │   │   ├── setup.ts                  # Migraciones + seed BD pruebas
│   │   │   ├── health.test.ts            # Health check
│   │   │   ├── auth.test.ts              # Register, login, refresh, logout, RBAC
│   │   │   ├── webhooks.test.ts          # Handshake, firma HMAC, validación Zod
│   │   │   ├── sync.test.ts              # Sync batch, validación campos
│   │   │   ├── properties.test.ts        # Filtros SQL, paginación, sort, casos borde
│   │   │   └── rate-limit.test.ts        # Comportamiento rate limiter
│   │   ├── db/
│   │   │   ├── index.ts                  # Pool PostgreSQL y helper consultas
│   │   │   └── migrate.ts                # Ejecutor migraciones + seed admin users
│   │   ├── middleware/
│   │   │   ├── auth.ts                   # JWT verify + RBAC (authenticate, authorize)
│   │   │   ├── rateLimit.ts              # Limitadores: global, auth, webhook, sync
│   │   │   ├── validate.ts               # Middleware esquema Zod
│   │   │   └── webhookSignature.ts       # Verificación HMAC-SHA256
│   │   └── routes/
│   │       ├── auth.ts                   # Auth JWT: register, login, refresh, logout, me
│   │       ├── webhooks.ts               # Módulo 1: Webhook handler + HMAC
│   │       ├── sync.ts                   # Módulo 2: Endpoint sync batch
│   │       └── properties.ts             # Módulo 3: Constructor SQL filtros
│   ├── jest.config.ts                    # Configuración Jest
│   ├── .env / .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                             # Next.js 14 App Router
│   ├── app/
│   │   ├── globals.css                   # Tema B2B oscuro (variables CSS)
│   │   ├── layout.tsx                    # Layout raíz con AuthProvider + Sidebar + SW
│   │   ├── page.tsx                      # Dashboard con health check
│   │   ├── login/page.tsx                # Login/registro con credenciales demo
│   │   ├── webhooks/page.tsx             # UI tester webhook
│   │   ├── ledger/page.tsx               # UI ledger offline
│   │   └── properties/page.tsx           # UI búsqueda propiedades
│   ├── components/
│   │   ├── ui/                           # Componentes shadcn/ui
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── table.tsx
│   │   ├── Sidebar.tsx                   # Barra lateral + estado auth
│   │   ├── SWRegister.tsx                # Registro Service Worker
│   │   ├── WebhookTester.tsx             # Módulo 1: simulador payload
│   │   ├── OfflineLedger.tsx             # Módulo 2: formulario offline + sync
│   │   └── PropertySearch.tsx            # Módulo 3: multi-filtro + tabla
│   ├── lib/
│   │   ├── api.ts                        # Wrapper fetch + tipos
│   │   ├── auth-context.tsx              # Auth provider (login, logout, token mgmt)
│   │   ├── indexed-db.ts                # Operaciones IndexedDB
│   │   ├── sw-register.ts               # Lógica registro SW
│   │   └── utils.ts                     # Utilidad cn()
│   ├── public/
│   │   └── sw.js                        # Service Worker (sync offline)
│   ├── package.json
│   └── tsconfig.json
│
├── e2e/                                   # Pruebas E2E Playwright (12 tests)
│   ├── auth.spec.ts                       # Login, register, estados error
│   ├── dashboard.spec.ts                  # Health check, navegación
│   ├── webhooks.spec.ts                   # Simulador webhook
│   ├── ledger.spec.ts                     # Formulario offline, sync, estado
│   └── properties.spec.ts                # Filtros, reset, tabla
│
├── database/
│   └── migrations/
│       ├── 001_initial.sql                # Esquema + datos semilla (10 propiedades)
│       └── 002_auth.sql                   # Tablas users + refresh_tokens
│
├── playwright.config.ts                   # Configuración Playwright
├── package.json                           # Scripts workspace raíz
└── README.md                              # Este archivo
```

---



---

<p align="center">
  Construido con ❤️ para el portafolio de Upwork.
  <br>
  <a href="README.md">Read in English</a> ·
  <a href="README.de.md">Auf Deutsch lesen</a>
</p>
