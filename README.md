<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nginx.svg">
  <img alt="banner" src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nginx.svg" width="100%" height="180">
</picture>

<h1 align="center">🏢 Enterprise B2B Automation Hub</h1>

<p align="center">
  <strong>Full-stack MVP · Express + Next.js 14 + PostgreSQL · TypeScript</strong>
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
  <a href="#-overview">Overview</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-modules">Modules</a> ·
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-api-reference">API Reference</a> ·
  <a href="#-testing">Testing</a> ·
  <a href="#-next-steps">Next Steps</a>
</p>

<p align="center">
  <a href="README.es.md">Español</a> ·
  <a href="README.de.md">Deutsch</a>
</p>

---

## 📋 Overview

A universal **Enterprise B2B Automation Hub** — a single full-stack MVP repository engineered to demonstrate production-grade patterns across three critical domains:

| Domain | Problem | Solution |
|--------|---------|----------|
| 🇮🇳 Meta/WhatsApp Webhooks | Handshake verification & complex payload ingestion | Verified webhook endpoint with Zod validation & atomic PostgreSQL writes |
| 🇺🇸 PWA Offline-First Ledger | Data entry without connectivity | IndexedDB queue + Service Worker sync engine |
| 🏥 Medical Property Catalog | Numeric range filtering at scale | Custom SQL filter builder with prepared statements |

### ✨ Why This Project?

Instead of building three separate mini-projects, this single repository covers **three portfolio-proof modules** that hiring managers at B2B SaaS companies, health-tech startups, and marketing agencies want to see. Every route is hardened with:

- ✅ **Strict TypeScript** end-to-end
- ✅ **Zod runtime validation**
- ✅ **Parameterized SQL queries** (no injection)
- ✅ **Atomic transactions**
- ✅ **Zero-dependency offline fallback** (raw IndexedDB)
- ✅ **Production-grade error handling**
- ✅ **JWT authentication** with access/refresh token rotation
- ✅ **Role-based access control** (admin, manager, viewer)
- ✅ **Rate limiting** per endpoint (global, auth, webhook, sync)
- ✅ **Webhook HMAC-SHA256** signature verification
- ✅ **37 Jest integration tests** covering all routes
- ✅ **12 Playwright E2E tests** covering all user flows

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Dashboard │  │ Webhook  │  │  Offline Ledger      │  │
│  │   Page    │  │  Tester  │  │  (IndexedDB + SW)    │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Property Search (SQL Filter Builder)      │  │
│  └──────────────────────────────────────────────────┘  │
│                         │ proxy                         │
│                 ┌───────┴───────┐                       │
│                 │  Next.js API  │                       │
│                 │    Rewrites   │                       │
│                 └───────┬───────┘                       │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP
┌─────────────────────────┼───────────────────────────────┐
│              Backend (Express + TypeScript)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Webhooks │  │   Sync   │  │  Properties/Search   │  │
│  │  Router  │  │ Endpoint │  │  (Custom SQL Builder) │  │
│  ├──────────┤  ├──────────┤  ├──────────────────────┤  │
│  │  Zod     │  │  Batch   │  │  Parameterized       │  │
│  │ Validation│  │ Insert   │  │  BETWEEN Queries     │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       └──────────────┴──────────────────┘               │
│                         │ pg                            │
│                 ┌───────┴───────┐                       │
│                 │  PostgreSQL   │                       │
│                 │  (Supabase)   │                       │
│                 └───────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR, file-based routing, React Server Components |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui | Dark B2B theme, utility-first, zero-runtime CSS |
| **Backend** | Express 4.18 + TypeScript | Most requested in freelance contracts, lightweight |
| **Validation** | Zod 3.23 | Runtime type safety, auto-error formatting |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | Access/refresh token rotation, http-only cookies |
| **RBAC** | Custom middleware | 3 roles: admin, manager, viewer |
| **Rate Limiting** | express-rate-limit | Per-endpoint: global 100/min, auth 10/min, webhook 30/min, sync 60/min |
| **Webhook Security** | HMAC-SHA256 | Timestamp + payload signing, timing-safe comparison |
| **Database** | PostgreSQL 16 (via `pg`) | CTEs, JSONB, window functions, array columns |
| **Offline** | IndexedDB + Service Worker | Native browser APIs, zero dependencies |
| **Integration Tests** | Jest 30 + Supertest | 37 tests across health, auth, webhooks, sync, properties |
| **E2E Tests** | Playwright | 12 tests across dashboard, auth, webhook, ledger, properties |

---

## 🧩 Modules

### Module 1: Webhook Router — `/api/webhooks`

**Simulates Meta's WhatsApp Business API webhook handshake and payload processing.**

```http
# Verification (GET)
GET /api/webhooks?hub.mode=subscribe&hub.verify_token=supersecret_token_123&hub.challenge=CHALLENGE_ACCEPTED

# Event ingestion (POST)
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
          "text": { "body": "Interested in your services!" }
        }]
      },
      "field": "messages"
    }]
  }]
}
```

**What it demonstrates:**
- SHA256-like token handshake (`hub.verify_token`)
- Deeply nested JSON parsing with Zod
- Atomic `INSERT` into PostgreSQL with JSONB payload
- Support for `text`, `button_reply`, and `nfm_reply` interactive messages
- Frontend simulator: paste any payload, set token, inspect stored events

---

### Module 2: Offline-First Ledger — `/api/sync`

**A ledger entry system that works with or without internet connectivity.**

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│  User    │────▶│  POST /sync  │◀───▶│  Service Worker │
│  Form    │     │  (online)    │     │  (offline queue) │
└──────────┘     └──────┬───────┘     └────────┬────────┘
                        │                      │
                   ┌────▼────┐           ┌─────▼─────┐
                   │PostgreSQL│           │ IndexedDB │
                   │ ledger   │           │ pending   │
                   │_entries  │           │ -sync     │
                   └─────────┘           └───────────┘
```

**Flow:**
1. User submits form → frontend attempts `POST /api/sync`
2. **If online:** data written directly to PostgreSQL
3. **If offline:** data persisted to IndexedDB (`pending-sync` store)
4. Service Worker listens for `online` event → reads IndexedDB → batch `POST /api/sync` → clears queue → dispatches `SYNC_COMPLETE`
5. UI updates via `sync-complete` custom event

**What it demonstrates:**
- Service Worker lifecycle (install, activate, fetch interception, message passing)
- Raw IndexedDB CRUD operations (no libraries)
- Online/offline detection with visual indicators
- Batch transaction processing with PostgreSQL `BEGIN/COMMIT`
- Conflict-free sync with `client_created_at` timestamps

---

### Module 3: Relational Filter Index — `/api/properties/search`

**A custom SQL filter builder designed for medical/commercial property catalogs.**

```sql
SELECT id, name, square_footage, bedrooms, bathrooms, price,
       location_city, location_state
FROM properties
WHERE property_type = $1
  AND square_footage BETWEEN $2 AND $3   -- 🔥 Custom range
  AND price         BETWEEN $4 AND $5
  AND bedrooms      >= $6
  AND location_state = $7
ORDER BY price DESC
LIMIT 20 OFFSET 0;
```

**Supported filters:**

| Parameter | Type | Example | SQL |
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
| `sort_by` | string | `price` | `ORDER BY` (whitelisted) |
| `sort_order` | asc/desc | `desc` | `ASC/DESC` |

**What it demonstrates:**
- Dynamic SQL query construction with **parameterized statements** (no injection)
- Dynamic `$N` parameter indexing
- Column whitelist for `ORDER BY` (prevents SQL injection in sort clause)
- `COUNT(*)` pagination with `LIMIT/OFFSET`
- Indexed columns (`idx_properties_price`, `idx_properties_square_footage`)
- Seed data: 10 properties across 4 types (medical, residential, motel, commercial)

---

## 🛡 Security Layer

### 1. JWT Authentication — `/api/auth`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account (default role: `viewer`) |
| `/api/auth/login` | POST | Receive access token + http-only refresh cookie |
| `/api/auth/refresh` | POST | Rotate tokens using http-only cookie |
| `/api/auth/logout` | POST | Invalidate refresh token |
| `/api/auth/me` | GET | Get current user profile (requires Bearer token) |

**Token flow:**

```
┌──────────┐  POST /login   ┌──────────────┐
│  Client  │ ──────────────▶│   Express    │
│          │◀────────────── │              │
│          │  { accessToken │  Validate    │
│          │    + Set-Cookie│  credentials │
│          │    refresh_    │              │
│          │    token }     │  Generate    │
│          │                │  access(15m) │
│          │  GET /me       │  refresh(7d) │
│          │  Authorization:│              │
│          │  Bearer <token>│  Verify JWT  │
│          │◀────────────── │  + RBAC      │
└──────────┘                └──────────────┘
```

**Seed users** (created by migration):
| Email | Password | Role |
|-------|----------|------|
| `admin@b2bhub.com` | `Admin123!` | `admin` |
| `manager@b2bhub.com` | `Manager123!` | `manager` |

### 2. Role-Based Access Control (RBAC)

Three roles with granular middleware:

| Role | Permissions |
|------|------------|
| **admin** | Full access to all routes and data |
| **manager** | Read/write on modules, no user management |
| **viewer** | Read-only access to dashboards and search |

Usage in routes:
```typescript
import { authenticate, authorize } from '../middleware/auth';

router.get('/admin', authenticate, authorize('admin'), handler);
router.post('/data', authenticate, authorize('admin', 'manager'), handler);
router.get('/search', authenticate, handler); // any authenticated user
```

### 3. Rate Limiting

| Limiter | Window | Max Requests | Applied To |
|---------|--------|-------------|------------|
| **Global** | 1 minute | 100 | Every endpoint |
| **Auth** | 1 minute | 10 | `/api/auth/*` |
| **Webhook** | 1 minute | 30 | `/api/webhooks` |
| **Sync** | 1 minute | 60 | `/api/sync` |

All limiters return `429 Too Many Requests` with a JSON error body when exceeded.

### 4. Webhook HMAC-SHA256 Signature Verification

Every incoming webhook `POST` must include:

| Header | Format | Example |
|--------|--------|---------|
| `x-webhook-signature` | `sha256=<hex>` | `sha256=a1b2c3...` |
| `x-webhook-timestamp` | Unix seconds | `1710000000` |

**Verification process:**
1. Server reads `x-webhook-timestamp` and rejects if more than 5 minutes old
2. Computes `HMAC-SHA256(webhookSecret, "${timestamp}.${rawBody}")`
3. Compares using `crypto.timingSafeEqual()` (timing-attack safe)
4. Rejects with `401` if signature doesn't match

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20 (v24.13.1 recommended)
- **PostgreSQL** ≥ 14 (or a Supabase account)
- **npm** ≥ 10

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd enterprise-b2b-automation-hub

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your PostgreSQL connection string

# Run database migrations
cd backend && npx tsx src/db/migrate.ts && cd ..

# Start both servers (or use two terminals)
npm run dev
```

The migration script creates three tables (`webhook_events`, `ledger_entries`, `properties`) and inserts **10 sample properties** across medical, residential, motel, and commercial types with realistic data.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Backend server port |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/b2b_hub` | PostgreSQL connection |
| `TEST_DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/b2b_hub_test` | Test database connection |
| `WEBHOOK_VERIFY_TOKEN` | `supersecret_token_123` | Token for webhook handshake |
| `WEBHOOK_SECRET` | `whsec_your_webhook_secret_here` | HMAC-SHA256 signing secret |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `JWT_ACCESS_SECRET` | `access-secret-change-in-production-abc123` | JWT access token signing key |
| `JWT_REFRESH_SECRET` | `refresh-secret-change-in-production-xyz789` | JWT refresh token signing key |

---

## 📡 API Reference

### `POST /api/auth/register`

Create a new user account.

```json
{ "email": "user@example.com", "password": "StrongPass123!", "name": "John Doe" }
```

**Response:** `201`
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe", "role": "viewer" },
  "accessToken": "eyJhbGci..."
}
```

**Response:** `409` — email already registered

---

### `POST /api/auth/login`

Authenticate and receive tokens.

```json
{ "email": "admin@b2bhub.com", "password": "Admin123!" }
```

**Response:** `200`
```json
{
  "user": { "id": "uuid", "email": "admin@b2bhub.com", "name": "Admin User", "role": "admin" },
  "accessToken": "eyJhbGci..."
}
```
**Cookies:** Sets `refresh_token` (http-only, secure, sameSite=strict, 7d)

**Response:** `401` — invalid credentials  
**Response:** `403` — account disabled

---

### `POST /api/auth/refresh`

Rotate access token using http-only refresh cookie.

**Response:** `200`
```json
{ "accessToken": "eyJhbGci..." }
```
**Response:** `401` — missing or expired refresh token

---

### `POST /api/auth/logout`

Invalidate the current refresh token.

**Response:** `200`
```json
{ "status": "logged_out" }
```

---

### `GET /api/auth/me`

Get current authenticated user profile.

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Response:** `200`
```json
{ "user": { "id": "uuid", "email": "admin@b2bhub.com", "name": "Admin User", "role": "admin" } }
```

---

### `GET /api/health`

Health check endpoint.

**Response:** `200`
```json
{ "status": "healthy", "timestamp": "2026-06-16T12:00:00.000Z" }
```

---

### `GET /api/webhooks`

WhatsApp Business API webhook verification handshake.

| Query Parameter | Value |
|----------------|-------|
| `hub.mode` | `subscribe` |
| `hub.verify_token` | Match `WEBHOOK_VERIFY_TOKEN` |
| `hub.challenge` | Echoed back on success |

**Response:** `200` — echoes `hub.challenge` value  
**Response:** `403` — if token doesn't match

---

### `POST /api/webhooks`

Ingest a WhatsApp Business API event.

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <WEBHOOK_VERIFY_TOKEN>` |
| `Content-Type` | `application/json` |

**Response:** `200`
```json
{ "status": "ok" }
```

**Validation:** Zod schema enforces `whatsapp_business_account` object structure. Invalid payloads return `400` with field-level error details.

---

### `GET /api/webhooks/events`

Retrieve stored webhook events (latest 50).

**Response:** `200` — array of webhook event objects with `id`, `source`, `event_type`, `payload`, `created_at`.

---

### `POST /api/sync`

Batch-sync offline ledger entries (max 100 per request).

```json
{
  "entries": [
    {
      "client_id": "client_001",
      "amount": 1500.00,
      "currency": "USD",
      "description": "Consultation fee",
      "client_created_at": "2026-06-16T10:00:00.000Z"
    }
  ]
}
```

**Response:** `201`
```json
{ "status": "synced", "count": 1, "ids": ["uuid-here"] }
```

---

### `GET /api/ledger`

Retrieve all synced ledger entries (latest 100).

---

### `GET /api/properties/search`

Search properties with dynamic filters.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `property_type` | No | Filter by type |
| `min_square_footage` | No | Minimum square footage |
| `max_square_footage` | No | Maximum square footage |
| `min_price` | No | Minimum price |
| `max_price` | No | Maximum price |
| `min_bedrooms` | No | Minimum bedrooms |
| `max_bedrooms` | No | Maximum bedrooms |
| `location_state` | No | Two-letter state code |
| `location_city` | No | City name (case-insensitive partial match) |
| `sort_by` | No | `price`, `square_footage`, `bedrooms`, `bathrooms`, `name`, `created_at` |
| `sort_order` | No | `asc` or `desc` |
| `limit` | No | Max 100 (default 20) |
| `offset` | No | Pagination offset |

**Response:** `200`
```json
{
  "data": [ { "id": "...", "name": "Sunset Medical Tower", "property_type": "medical", ... } ],
  "pagination": { "total": 3, "limit": 20, "offset": 0, "returned": 3 }
}
```

---

## 🧪 Testing

### Backend Integration Tests (Jest + Supertest)

37 tests covering every route and edge case:

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `health.test.ts` | 2 | status code, content-type, timestamp format |
| `auth.test.ts` | 9 | register, duplicate email, login, wrong password, me, refresh, logout, token validation |
| `webhooks.test.ts` | 7 | handshake success/fail, event ingestion, auth, signature verification, Zod validation |
| `sync.test.ts` | 6 | single entry, batch, empty array, negative amount, missing fields, schema validation |
| `properties.test.ts` | 11 | type filter, sqft BETWEEN, price BETWEEN, state filter, sorting, pagination, combined, no results, SQL injection guard |
| `rate-limit.test.ts` | 2 | requests under limit pass through |

```bash
# Run all integration tests (requires PostgreSQL)
cd backend && npm test
```

**Test database:** Uses `TEST_DATABASE_URL` env var (defaults to `b2b_hub_test`). Tables are created via migrations before tests and cleaned up after.

### E2E Tests (Playwright)

12 tests covering all user-facing flows:

| Test File | Tests | Flow |
|-----------|-------|------|
| `auth.spec.ts` | 4 | Login page renders, valid login redirects, wrong credentials error, register mode toggle |
| `dashboard.spec.ts` | 3 | Dashboard loads, API health status visible, card navigation works |
| `webhooks.spec.ts` | 2 | Page renders, can send test webhook |
| `ledger.spec.ts` | 3 | Page renders, add entry flow, online/offline status indicator |
| `properties.spec.ts` | 5 | Search renders, type filter, sqft range filter, reset filters, table rows visible |

```bash
# Run E2E tests (starts backend + frontend automatically)
npx playwright test

# With UI mode
npx playwright test --ui
```

### Manual API Testing with Curl

```bash
# Start backend
cd backend && npm run dev

# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"StrongPass123!","name":"Test"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@b2bhub.com","password":"Admin123!"}'

# Test webhook verification
curl "http://localhost:3001/api/webhooks?hub.mode=subscribe&hub.verify_token=supersecret_token_123&hub.challenge=test123"

# Test webhook event ingestion (with HMAC signature)
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "$TIMESTAMP.{\"object\":\"whatsapp_business_account\",\"entry\":[{\"id\":\"1\",\"changes\":[{\"value\":{\"messages\":[{\"from\":\"15551234567\",\"id\":\"msg1\",\"timestamp\":\"1710000000\",\"type\":\"text\",\"text\":{\"body\":\"Hello\"}}]},\"field\":\"messages\"}]}]}" | openssl dgst -sha256 -hmac "whsec_your_webhook_secret_here" | sed 's/^.* //')
curl -X POST http://localhost:3001/api/webhooks \
  -H "Authorization: Bearer supersecret_token_123" \
  -H "x-webhook-signature: sha256=$SIGNATURE" \
  -H "x-webhook-timestamp: $TIMESTAMP" \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"id":"1","changes":[{"value":{"messages":[{"from":"15551234567","id":"msg1","timestamp":"1710000000","type":"text","text":{"body":"Hello"}}]},"field":"messages"}]}]}'

# Test property search
curl "http://localhost:3001/api/properties/search?property_type=medical&min_square_footage=10000&max_price=10000000&sort_by=square_footage&sort_order=desc"

# Test health
curl http://localhost:3001/api/health
```

---

## 📁 Project Structure

```
enterprise-b2b-automation-hub/
│
├── backend/                              # Express + TypeScript API
│   ├── src/
│   │   ├── index.ts                      # Server entry, CORS, routing, rate limit
│   │   ├── config.ts                     # Environment configuration (JWT, rate limit, webhook)
│   │   ├── __tests__/                    # Jest integration tests (37 tests)
│   │   │   ├── setup.ts                  # Test DB migrations & seed
│   │   │   ├── health.test.ts            # Health check endpoint
│   │   │   ├── auth.test.ts              # Register, login, refresh, logout, RBAC
│   │   │   ├── webhooks.test.ts          # Handshake, HMAC signature, Zod validation
│   │   │   ├── sync.test.ts              # Batch sync, field validation
│   │   │   ├── properties.test.ts        # SQL filters, pagination, sort, edge cases
│   │   │   └── rate-limit.test.ts        # Rate limiter behavior
│   │   ├── db/
│   │   │   ├── index.ts                  # PostgreSQL pool & query helper
│   │   │   └── migrate.ts                # Migration runner + seed admin users
│   │   ├── middleware/
│   │   │   ├── auth.ts                   # JWT verify + RBAC (authenticate, authorize)
│   │   │   ├── rateLimit.ts              # Global, auth, webhook, sync limiters
│   │   │   ├── validate.ts               # Zod schema middleware
│   │   │   └── webhookSignature.ts       # HMAC-SHA256 verification
│   │   └── routes/
│   │       ├── auth.ts                   # JWT auth: register, login, refresh, logout, me
│   │       ├── webhooks.ts               # Module 1: Webhook handler + HMAC
│   │       ├── sync.ts                   # Module 2: Batch sync endpoint
│   │       └── properties.ts             # Module 3: SQL filter builder
│   ├── jest.config.ts                    # Jest configuration
│   ├── .env / .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                             # Next.js 14 App Router
│   ├── app/
│   │   ├── globals.css                   # Dark B2B theme (CSS variables)
│   │   ├── layout.tsx                    # Root layout with AuthProvider + Sidebar + SW
│   │   ├── page.tsx                      # Dashboard with health check
│   │   ├── login/page.tsx                # Login/register page with demo credentials
│   │   ├── webhooks/page.tsx             # Webhook tester UI
│   │   ├── ledger/page.tsx               # Offline ledger UI
│   │   └── properties/page.tsx           # Property search UI
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── table.tsx
│   │   ├── Sidebar.tsx                   # Navigation sidebar + auth status
│   │   ├── SWRegister.tsx                # Service Worker registration
│   │   ├── WebhookTester.tsx             # Module 1: payload simulator
│   │   ├── OfflineLedger.tsx             # Module 2: offline form + sync
│   │   └── PropertySearch.tsx            # Module 3: multi-filter + table
│   ├── lib/
│   │   ├── api.ts                        # Fetch wrapper + types
│   │   ├── auth-context.tsx              # Auth provider (login, logout, token mgmt)
│   │   ├── indexed-db.ts                # IndexedDB operations
│   │   ├── sw-register.ts               # SW registration logic
│   │   └── utils.ts                     # cn() utility
│   ├── public/
│   │   └── sw.js                        # Service Worker (offline sync)
│   ├── package.json
│   └── tsconfig.json
│
├── e2e/                                  # Playwright E2E tests (12 tests)
│   ├── auth.spec.ts                      # Login, register, error states
│   ├── dashboard.spec.ts                 # Health check, navigation
│   ├── webhooks.spec.ts                  # Webhook simulator
│   ├── ledger.spec.ts                    # Offline form, sync, status
│   └── properties.spec.ts               # Filters, reset, table display
│
├── database/
│   └── migrations/
│       ├── 001_initial.sql               # Schema + seed data (10 properties)
│       └── 002_auth.sql                  # Users + refresh_tokens tables
│
├── playwright.config.ts                  # Playwright configuration
├── package.json                          # Root workspace scripts
└── README.md                             # This file
```

---

<p align="center">
  <a href="README.es.md">Leer en Español</a> ·
  <a href="README.de.md">Auf Deutsch lesen</a>
</p>
