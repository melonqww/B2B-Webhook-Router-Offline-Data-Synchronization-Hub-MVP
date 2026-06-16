<h1 align="center">🏢 Enterprise B2B Automation Hub</h1>

<p align="center">
  <strong>Full-Stack MVP · Express + Next.js 14 + PostgreSQL · TypeScript</strong>
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
  <a href="README.es.md">Español</a>
</p>

---

## 📋 Überblick

Ein universeller **Enterprise B2B Automation Hub** — ein einzelnes Full-Stack MVP-Repository, das entwickelt wurde, um produktionsreife Muster in drei kritischen Bereichen zu demonstrieren:

| Bereich | Problem | Lösung |
|---------|---------|--------|
| 🇮🇳 Meta/WhatsApp-Webhooks | Handshake-Verifikation & komplexe Payload-Erfassung | Verifizierter Webhook-Endpoint mit Zod-Validierung & atomaren PostgreSQL-Schreibvorgängen |
| 🇺🇸 PWA Offline-First Ledger | Dateneingabe ohne Internetverbindung | IndexedDB-Warteschlange + Service-Worker-Sync-Engine |
| 🏥 Medizinisches Immobilienkatalog | Numerische Bereichsfilterung in großem Maßstab | Benutzerdefinierter SQL-Filter-Builder mit Prepared Statements |

### ✨ Warum Dieses Projekt?

Anstatt drei separate Mini-Projekte zu erstellen, deckt dieses Repository **drei portfolio-taugliche Module** ab, die Personalverantwortliche in B2B-SaaS-Unternehmen, Health-Tech-Startups und Marketingagenturen sehen möchten. Jede Route ist abgesichert mit:

- ✅ **Striktern TypeScript** durchgängig
- ✅ **Zod-Laufzeitvalidierung**
- ✅ **Parametrisierten SQL-Abfragen** (keine Injection)
- ✅ **Atomaren Transaktionen**
- ✅ **Null-Abhängigkeits-Offline-Fallback** (reines IndexedDB)
- ✅ **Produktionsreifer Fehlerbehandlung**
- ✅ **JWT-Authentifizierung** mit Access/Refresh-Token-Rotation
- ✅ **Rollenbasierte Zugriffskontrolle** (Admin, Manager, Betrachter)
- ✅ **Rate-Limiting** pro Endpunkt (global, auth, webhook, sync)
- ✅ **Webhook-HMAC-SHA256-Signaturprüfung**
- ✅ **37 Jest-Integrationstests** für alle Routen
- ✅ **12 Playwright-E2E-Tests** für alle Benutzerabläufe

---

## 🏛 Architektur

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 14)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Dashboard │  │ Webhook  │  │  Offline Ledger     │  │
│  │   Page    │  │  Tester  │  │  (IndexedDB + SW)   │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Property Search (SQL Filter Builder)           │  │
│  └──────────────────────────────────────────────────┘  │
│                         │ proxy                         │
│                 ┌───────┴───────┐                       │
│                 │  Next.js API  │                       │
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
│  │  Zod     │  │  Batch   │  │ Parametrisierte      │  │
│  │ Validier.│  │ Insert   │  │ BETWEEN-Abfragen     │  │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘  │
│       └──────────────┴──────────────────┘               │
│                         │ pg                            │
│                 ┌───────┴───────┐                       │
│                 │  PostgreSQL   │                       │
│                 │  (Supabase)   │                       │
│                 └───────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Technologie-Stack

| Ebene | Technologie | Warum |
|-------|-----------|-------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR, dateibasiertes Routing, React Server Components |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui | Dunkles B2B-Theme, utility-first, Zero-Runtime-CSS |
| **Backend** | Express 4.18 + TypeScript | Am häufigsten in Freelance-Verträgen gefragt, leichtgewichtig |
| **Validierung** | Zod 3.23 | Laufzeit-Typsicherheit, automatische Fehlerformatierung |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | Access/Refresh-Token-Rotation, http-only-Cookies |
| **RBAC** | Benutzerdefiniertes Middleware | 3 Rollen: Admin, Manager, Betrachter |
| **Rate-Limiting** | express-rate-limit | Pro Endpunkt: global 100/min, auth 10/min, webhook 30/min, sync 60/min |
| **Webhook-Sicherheit** | HMAC-SHA256 | Zeitstempel- + Payload-Signierung, Timing-sicherer Vergleich |
| **Datenbank** | PostgreSQL 16 (via `pg`) | CTEs, JSONB, Window-Funktionen, Array-Spalten |
| **Offline** | IndexedDB + Service Worker | Native Browser-APIs, keine Abhängigkeiten |
| **Integrationstests** | Jest 30 + Supertest | 37 Tests für health, auth, webhooks, sync, properties |
| **E2E-Tests** | Playwright | 12 Tests für Dashboard, Auth, Webhook, Ledger, Properties |

---

## 🧩 Module

### Modul 1: Webhook Router — `/api/webhooks`

**Simuliert den Handshake und die Payload-Verarbeitung der Meta WhatsApp Business API.**

```http
# Verifikation (GET)
GET /api/webhooks?hub.mode=subscribe&hub.verify_token=supersecret_token_123&hub.challenge=CHALLENGE_ACCEPTED

# Ereignis-Erfassung (POST)
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
          "text": { "body": "Interessiert an Ihren Dienstleistungen!" }
        }]
      },
      "field": "messages"
    }]
  }]
}
```

**Was es demonstriert:**
- SHA256-ähnlicher Token-Handshake (`hub.verify_token`)
- Tief verschachteltes JSON-Parsing mit Zod
- Atomarer `INSERT` in PostgreSQL mit JSONB-Payload
- Unterstützung für `text`, `button_reply` und `nfm_reply` interaktive Nachrichten
- Frontend-Simulator: beliebigen Payload einfügen, Token setzen, gespeicherte Ereignise inspizieren

---

### Modul 2: Offline-First Ledger — `/api/sync`

**Ein Ledger-Eintragssystem, das mit oder ohne Internetverbindung funktioniert.**

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│ Benutzer │────▶│  POST /sync  │◀───▶│  Service Worker │
│ Formular │     │  (online)    │     │  (Offline-Queue)│
└──────────┘     └──────┬───────┘     └────────┬────────┘
                        │                      │
                   ┌────▼────┐           ┌─────▼─────┐
                   │PostgreSQL│           │ IndexedDB │
                   │ ledger   │           │ pending   │
                   │_entries  │           │ -sync     │
                   └─────────┘           └───────────┘
```

**Ablauf:**
1. Benutzer sendet Formular → Frontend versucht `POST /api/sync`
2. **Wenn online:** Daten direkt in PostgreSQL geschrieben
3. **Wenn offline:** Daten in IndexedDB gespeichert (`pending-sync`-Speicher)
4. Service Worker hört auf `online`-Ereignis → liest IndexedDB → batch `POST /api/sync` → leert Queue → sendet `SYNC_COMPLETE`
5. UI aktualisiert via benutzerdefiniertem `sync-complete`-Ereignis

**Was es demonstriert:**
- Service Worker Lebenszyklus (install, activate, fetch-Interception, Nachrichtenaustausch)
- Reine IndexedDB CRUD-Operationen (keine Bibliotheken)
- Online/Offline-Erkennung mit visuellen Indikatoren
- Batch-Transaktionsverarbeitung mit PostgreSQL `BEGIN/COMMIT`
- Konfliktfreie Synchronisation mit `client_created_at`-Timestamps

---

### Modul 3: Relational Filter Index — `/api/properties/search`

**Ein benutzerdefinierter SQL-Filter-Builder für medizinische/gewerbliche Immobilienkataloge.**

```sql
SELECT id, name, square_footage, bedrooms, bathrooms, price,
       location_city, location_state
FROM properties
WHERE property_type = $1
  AND square_footage BETWEEN $2 AND $3   -- 🔥 Benutzerdefinierter Bereich
  AND price         BETWEEN $4 AND $5
  AND bedrooms      >= $6
  AND location_state = $7
ORDER BY price DESC
LIMIT 20 OFFSET 0;
```

**Unterstützte Filter:**

| Parameter | Typ | Beispiel | SQL |
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
| `sort_by` | string | `price` | `ORDER BY` (Whitelist) |
| `sort_order` | asc/desc | `desc` | `ASC/DESC` |

**Was es demonstriert:**
- Dynamische SQL-Abfragekonstruktion mit **parametrisierten Anweisungen** (keine Injection)
- Dynamische `$N`-Parameterindizierung
- Spalten-Whitelist für `ORDER BY` (verhindert SQL-Injection in der Sortierklausel)
- `COUNT(*)`-Paginierung mit `LIMIT/OFFSET`
- Indizierte Spalten (`idx_properties_price`, `idx_properties_square_footage`)
- Seed-Daten: 10 Immobilien in 4 Typen (medical, residential, motel, commercial)

---

## 🛡 Sicherheitsschicht

### 1. JWT-Authentifizierung — `/api/auth`

| Endpunkt | Methode | Beschreibung |
|----------|---------|-------------|
| `/api/auth/register` | POST | Konto erstellen (Standardrolle: `viewer`) |
| `/api/auth/login` | POST | Access-Token + http-only-Refresh-Cookie erhalten |
| `/api/auth/refresh` | POST | Tokens mit http-only-Cookie rotieren |
| `/api/auth/logout` | POST | Refresh-Token ungültig machen |
| `/api/auth/me` | GET | Aktuelles Benutzerprofil abrufen (erfordert Bearer-Token) |

**Token-Ablauf:**

```
┌──────────┐  POST /login   ┌──────────────┐
│  Client  │ ──────────────▶│   Express    │
│          │◀────────────── │              │
│          │  { accessToken │  Anmelde-    │
│          │    + Set-Cookie│  daten prüfen│
│          │    refresh_    │              │
│          │    token }     │  Generieren  │
│          │                │  access(15m) │
│          │  GET /me       │  refresh(7d) │
│          │  Authorization:│              │
│          │  Bearer <token>│  JWT + RBAC  │
│          │◀────────────── │  prüfen      │
└──────────┘                └──────────────┘
```

**Seed-Benutzer** (von Migration erstellt):
| E-Mail | Passwort | Rolle |
|--------|----------|-------|
| `admin@b2bhub.com` | `Admin123!` | `admin` |
| `manager@b2bhub.com` | `Manager123!` | `manager` |

### 2. Rollenbasierte Zugriffskontrolle (RBAC)

Drei Rollen mit granularem Middleware:

| Rolle | Berechtigungen |
|-------|----------------|
| **admin** | Vollzugriff auf alle Routen und Daten |
| **manager** | Lese-/Schreibzugriff auf Module, keine Benutzerverwaltung |
| **viewer** | Schreibgeschützter Zugriff auf Dashboards und Suche |

Verwendung in Routen:
```typescript
import { authenticate, authorize } from '../middleware/auth';

router.get('/admin', authenticate, authorize('admin'), handler);
router.post('/data', authenticate, authorize('admin', 'manager'), handler);
router.get('/search', authenticate, handler); // jeder authentifizierte Benutzer
```

### 3. Rate-Limiting

| Begrenzer | Fenster | Max. Anfragen | Angewendet auf |
|-----------|---------|---------------|----------------|
| **Global** | 1 Minute | 100 | Jeder Endpunkt |
| **Auth** | 1 Minute | 10 | `/api/auth/*` |
| **Webhook** | 1 Minute | 30 | `/api/webhooks` |
| **Sync** | 1 Minute | 60 | `/api/sync` |

Alle Begrenzer geben `429 Too Many Requests` mit einem JSON-Fehlerbody zurück, wenn das Limit überschritten wird.

### 4. Webhook-HMAC-SHA256-Signaturprüfung

Jeder eingehende Webhook-`POST` muss enthalten:

| Header | Format | Beispiel |
|--------|--------|---------|
| `x-webhook-signature` | `sha256=<hex>` | `sha256=a1b2c3...` |
| `x-webhook-timestamp` | Unix-Sekunden | `1710000000` |

**Prüfprozess:**
1. Server liest `x-webhook-timestamp` und lehnt ab, wenn älter als 5 Minuten
2. Berechnet `HMAC-SHA256(webhookSecret, "${timestamp}.${rawBody}")`
3. Vergleicht mit `crypto.timingSafeEqual()` (sicher gegen Timing-Angriffe)
4. Lehnt mit `401` ab, wenn Signatur nicht übereinstimmt

---

## 🚀 Schnellstart

### Voraussetzungen

- **Node.js** ≥ 20 (v24.13.1 empfohlen)
- **PostgreSQL** ≥ 14 (oder ein Supabase-Konto)
- **npm** ≥ 10

### Einrichtung

```bash
# Repository klonen
git clone <ihre-repo-url>
cd enterprise-b2b-automation-hub

# Abhängigkeiten installieren
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Umgebung konfigurieren
cp backend/.env.example backend/.env
# backend/.env mit Ihrem PostgreSQL-Verbindungsstring bearbeiten

# Datenbank-Migrationen ausführen
cd backend && npx tsx src/db/migrate.ts && cd ..

# Beide Server starten (oder zwei Terminals verwenden)
npm run dev
```

Das Migrationsskript erstellt drei Tabellen (`webhook_events`, `ledger_entries`, `properties`) und fügt **10 Beispiel-Immobilien** in den Typen medical, residential, motel und commercial mit realistischen Daten ein.

### Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|---------|-------------|
| `PORT` | `3001` | Backend-Server-Port |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/b2b_hub` | PostgreSQL-Verbindung |
| `TEST_DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/b2b_hub_test` | Testdatenbank-Verbindung |
| `WEBHOOK_VERIFY_TOKEN` | `supersecret_token_123` | Token für Webhook-Handshake |
| `WEBHOOK_SECRET` | `whsec_your_webhook_secret_here` | HMAC-SHA256-Signierschlüssel |
| `CORS_ORIGIN` | `http://localhost:3000` | Erlaubter Frontend-Ursprung |
| `JWT_ACCESS_SECRET` | `access-secret-change-in-production-abc123` | JWT-Access-Token-Signierschlüssel |
| `JWT_REFRESH_SECRET` | `refresh-secret-change-in-production-xyz789` | JWT-Refresh-Token-Signierschlüssel |

---

## 📡 API-Referenz

### `POST /api/auth/register`

Ein neues Benutzerkonto erstellen.

```json
{ "email": "user@example.com", "password": "StrongPass123!", "name": "John Doe" }
```

**Antwort:** `201`
```json
{
  "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe", "role": "viewer" },
  "accessToken": "eyJhbGci..."
}
```

**Antwort:** `409` — E-Mail bereits registriert

---

### `POST /api/auth/login`

Anmelden und Tokens erhalten.

```json
{ "email": "admin@b2bhub.com", "password": "Admin123!" }
```

**Antwort:** `200`
```json
{
  "user": { "id": "uuid", "email": "admin@b2bhub.com", "name": "Admin User", "role": "admin" },
  "accessToken": "eyJhbGci..."
}
```
**Cookies:** Setzt `refresh_token` (http-only, secure, sameSite=strict, 7d)

**Antwort:** `401` — ungültige Anmeldedaten  
**Antwort:** `403` — Konto deaktiviert

---

### `POST /api/auth/refresh`

Access-Token mit http-only-Refresh-Cookie rotieren.

**Antwort:** `200`
```json
{ "accessToken": "eyJhbGci..." }
```
**Antwort:** `401` — fehlender oder abgelaufener Refresh-Token

---

### `POST /api/auth/logout`

Den aktuellen Refresh-Token ungültig machen.

**Antwort:** `200`
```json
{ "status": "logged_out" }
```

---

### `GET /api/auth/me`

Aktuelles authentifiziertes Benutzerprofil abrufen.

| Header | Wert |
|--------|------|
| `Authorization` | `Bearer <accessToken>` |

**Antwort:** `200`
```json
{ "user": { "id": "uuid", "email": "admin@b2bhub.com", "name": "Admin User", "role": "admin" } }
```

---

### `GET /api/health`

Health-Check-Endpoint.

**Antwort:** `200`
```json
{ "status": "healthy", "timestamp": "2026-06-16T12:00:00.000Z" }
```

---

### `GET /api/webhooks`

WhatsApp Business API Webhook-Verifikationshandshake.

| Query-Parameter | Wert |
|----------------|-------|
| `hub.mode` | `subscribe` |
| `hub.verify_token` | Muss mit `WEBHOOK_VERIFY_TOKEN` übereinstimmen |
| `hub.challenge` | Wird bei Erfolg zurückgegeben |

**Antwort:** `200` — gibt `hub.challenge`-Wert zurück  
**Antwort:** `403` — wenn Token nicht übereinstimmt

---

### `POST /api/webhooks`

WhatsApp Business API-Ereignis erfassen.

| Header | Wert |
|--------|-------|
| `Authorization` | `Bearer <WEBHOOK_VERIFY_TOKEN>` |
| `Content-Type` | `application/json` |

**Antwort:** `200`
```json
{ "status": "ok" }
```

**Validierung:** Zod-Schema erzwingt `whatsapp_business_account`-Objektstruktur. Ungültige Payloads geben `400` mit feldbezogenen Fehlerdetails zurück.

---

### `GET /api/webhooks/events`

Gespeicherte Webhook-Ereignisse abrufen (letzte 50).

**Antwort:** `200` — Array von Webhook-Ereignisobjekten mit `id`, `source`, `event_type`, `payload`, `created_at`.

---

### `POST /api/sync`

Batch-Synchronisation von Offline-Ledger-Einträgen (max. 100 pro Anfrage).

```json
{
  "entries": [
    {
      "client_id": "client_001",
      "amount": 1500.00,
      "currency": "USD",
      "description": "Beratungsgebühr",
      "client_created_at": "2026-06-16T10:00:00.000Z"
    }
  ]
}
```

**Antwort:** `201`
```json
{ "status": "synced", "count": 1, "ids": ["uuid-here"] }
```

---

### `GET /api/ledger`

Alle synchronisierten Ledger-Einträge abrufen (letzte 100).

---

### `GET /api/properties/search`

Immobilien mit dynamischen Filtern suchen.

| Parameter | Erforderlich | Beschreibung |
|-----------|-------------|-------------|
| `property_type` | Nein | Nach Typ filtern |
| `min_square_footage` | Nein | Minimale Quadratmeterzahl |
| `max_square_footage` | Nein | Maximale Quadratmeterzahl |
| `min_price` | Nein | Mindestpreis |
| `max_price` | Nein | Maximalpreis |
| `min_bedrooms` | Nein | Minimale Schlafzimmer |
| `max_bedrooms` | Nein | Maximale Schlafzimmer |
| `location_state` | Nein | Zwei-Buchstaben-Bundesstaatscode |
| `location_city` | Nein | Stadtname (case-insensitive teilweise Übereinstimmung) |
| `sort_by` | Nein | `price`, `square_footage`, `bedrooms`, `bathrooms`, `name`, `created_at` |
| `sort_order` | Nein | `asc` oder `desc` |
| `limit` | Nein | Max. 100 (Standard 20) |
| `offset` | Nein | Paginierungsversatz |

**Antwort:** `200`
```json
{
  "data": [ { "id": "...", "name": "Sunset Medical Tower", "property_type": "medical", ... } ],
  "pagination": { "total": 3, "limit": 20, "offset": 0, "returned": 3 }
}
```

---

## 🧪 Testen

### Backend-Integrationstests (Jest + Supertest)

37 Tests, die jede Route und jeden Grenzfall abdecken:

| Testdatei | Tests | Abdeckung |
|-----------|-------|-----------|
| `health.test.ts` | 2 | Statuscode, Content-Type, Zeitstempelformat |
| `auth.test.ts` | 9 | Registrierung, doppelte E-Mail, Login, falsches Passwort, me, Refresh, Logout, Token-Validierung |
| `webhooks.test.ts` | 7 | Handshake Erfolg/Fehler, Ereigniserfassung, Auth, Signaturprüfung, Zod-Validierung |
| `sync.test.ts` | 6 | Einzeleintrag, Batch, leeres Array, negativer Betrag, fehlende Felder, Schema-Validierung |
| `properties.test.ts` | 11 | Typfilter, sqft BETWEEN, Preis BETWEEN, Staat-Filter, Sortierung, Paginierung, kombiniert, keine Ergebnisse, SQL-Injection-Schutz |
| `rate-limit.test.ts` | 2 | Anfragen unter Limit passieren korrekt |

```bash
# Alle Integrationstests ausführen (erfordert PostgreSQL)
cd backend && npm test
```

**Testdatenbank:** Verwendet `TEST_DATABASE_URL`-Umgebungsvariable (standardmäßig `b2b_hub_test`). Tabellen werden vor Tests via Migration erstellt und danach bereinigt.

### E2E-Tests (Playwright)

12 Tests, die alle benutzerorientierten Abläufe abdecken:

| Testdatei | Tests | Ablauf |
|-----------|-------|--------|
| `auth.spec.ts` | 4 | Login-Seite rendert, gültiges Login leitet weiter, falsche Anmeldedaten Fehler, Registrierungsmodus |
| `dashboard.spec.ts` | 3 | Dashboard lädt, API-Health-Status sichtbar, Kartennavigation funktioniert |
| `webhooks.spec.ts` | 2 | Seite rendert, kann Test-Webhook senden |
| `ledger.spec.ts` | 3 | Seite rendert, Eintrag hinzufügen, Online/Offline-Statusanzeige |
| `properties.spec.ts` | 5 | Suche rendert, Typfilter, sqft-Bereichsfilter, Filter zurücksetzen, Tabellenzeilen sichtbar |

```bash
# E2E-Tests ausführen (startet Backend + Frontend automatisch)
npx playwright test

# Mit UI-Modus
npx playwright test --ui
```

### Manuelle API-Tests mit Curl

```bash
# Backend starten
cd backend && npm run dev

# Neuen Benutzer registrieren
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"StrongPass123!","name":"Test"}'

# Anmelden
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@b2bhub.com","password":"Admin123!"}'

# Webhook-Verifikation testen
curl "http://localhost:3001/api/webhooks?hub.mode=subscribe&hub.verify_token=supersecret_token_123&hub.challenge=test123"

# Webhook-Ereigniserfassung testen (mit HMAC-Signatur)
TIMESTAMP=$(date +%s)
SIGNATURE=$(echo -n "$TIMESTAMP.{\"object\":\"whatsapp_business_account\",\"entry\":[{\"id\":\"1\",\"changes\":[{\"value\":{\"messages\":[{\"from\":\"15551234567\",\"id\":\"msg1\",\"timestamp\":\"1710000000\",\"type\":\"text\",\"text\":{\"body\":\"Hello\"}}]},\"field\":\"messages\"}]}]}" | openssl dgst -sha256 -hmac "whsec_your_webhook_secret_here" | sed 's/^.* //')
curl -X POST http://localhost:3001/api/webhooks \
  -H "Authorization: Bearer supersecret_token_123" \
  -H "x-webhook-signature: sha256=$SIGNATURE" \
  -H "x-webhook-timestamp: $TIMESTAMP" \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"id":"1","changes":[{"value":{"messages":[{"from":"15551234567","id":"msg1","timestamp":"1710000000","type":"text","text":{"body":"Hello"}}]},"field":"messages"}]}]}'

# Immobiliensuche testen
curl "http://localhost:3001/api/properties/search?property_type=medical&min_square_footage=10000&max_price=10000000&sort_by=square_footage&sort_order=desc"

# Health testen
curl http://localhost:3001/api/health
```

---

## 📁 Projektstruktur

```
enterprise-b2b-automation-hub/
│
├── backend/                              # Express + TypeScript API
│   ├── src/
│   │   ├── index.ts                      # Server-Einstieg, CORS, Routing, Rate Limit
│   │   ├── config.ts                     # Umgebungskonfiguration (JWT, Rate Limit, Webhook)
│   │   ├── __tests__/                    # Jest-Integrationstests (37 Tests)
│   │   │   ├── setup.ts                  # Test-DB-Migrationen & Seed
│   │   │   ├── health.test.ts            # Health-Check-Endpoint
│   │   │   ├── auth.test.ts              # Register, Login, Refresh, Logout, RBAC
│   │   │   ├── webhooks.test.ts          # Handshake, HMAC-Signatur, Zod-Validierung
│   │   │   ├── sync.test.ts              # Batch-Sync, Feldvalidierung
│   │   │   ├── properties.test.ts        # SQL-Filter, Paginierung, Sortierung, Grenzfälle
│   │   │   └── rate-limit.test.ts        # Rate-Limiter-Verhalten
│   │   ├── db/
│   │   │   ├── index.ts                  # PostgreSQL-Pool & Query-Helper
│   │   │   └── migrate.ts                # Migrationsausführer + Admin-User-Seed
│   │   ├── middleware/
│   │   │   ├── auth.ts                   # JWT-Prüfung + RBAC (authenticate, authorize)
│   │   │   ├── rateLimit.ts              # Begrenzer: global, auth, webhook, sync
│   │   │   ├── validate.ts               # Zod-Schema-Middleware
│   │   │   └── webhookSignature.ts       # HMAC-SHA256-Prüfung
│   │   └── routes/
│   │       ├── auth.ts                   # JWT-Auth: register, login, refresh, logout, me
│   │       ├── webhooks.ts               # Modul 1: Webhook-Handler + HMAC
│   │       ├── sync.ts                   # Modul 2: Batch-Sync-Endpoint
│   │       └── properties.ts             # Modul 3: SQL-Filter-Builder
│   ├── jest.config.ts                    # Jest-Konfiguration
│   ├── .env / .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                             # Next.js 14 App Router
│   ├── app/
│   │   ├── globals.css                   # Dunkles B2B-Theme (CSS-Variablen)
│   │   ├── layout.tsx                    # Root-Layout mit AuthProvider + Sidebar + SW
│   │   ├── page.tsx                      # Dashboard mit Health-Check
│   │   ├── login/page.tsx                # Login/Registrierung mit Demo-Zugangsdaten
│   │   ├── webhooks/page.tsx             # Webhook-Tester-UI
│   │   ├── ledger/page.tsx               # Offline-Ledger-UI
│   │   └── properties/page.tsx           # Immobiliensuche-UI
│   ├── components/
│   │   ├── ui/                           # shadcn/ui-Komponenten
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── table.tsx
│   │   ├── Sidebar.tsx                   # Navigationsseitenleiste + Auth-Status
│   │   ├── SWRegister.tsx                # Service-Worker-Registrierung
│   │   ├── WebhookTester.tsx             # Modul 1: Payload-Simulator
│   │   ├── OfflineLedger.tsx             # Modul 2: Offline-Formular + Sync
│   │   └── PropertySearch.tsx            # Modul 3: Multi-Filter + Tabelle
│   ├── lib/
│   │   ├── api.ts                        # Fetch-Wrapper + Typen
│   │   ├── auth-context.tsx              # Auth-Provider (Login, Logout, Token-Verwaltung)
│   │   ├── indexed-db.ts                # IndexedDB-Operationen
│   │   ├── sw-register.ts               # SW-Registrierungslogik
│   │   └── utils.ts                     # cn()-Utility
│   ├── public/
│   │   └── sw.js                        # Service Worker (Offline-Sync)
│   ├── package.json
│   └── tsconfig.json
│
├── e2e/                                   # Playwright-E2E-Tests (12 Tests)
│   ├── auth.spec.ts                       # Login, Registrierung, Fehlerzustände
│   ├── dashboard.spec.ts                  # Health-Check, Navigation
│   ├── webhooks.spec.ts                   # Webhook-Simulator
│   ├── ledger.spec.ts                     # Offline-Formular, Sync, Status
│   └── properties.spec.ts                # Filter, Zurücksetzen, Tabellenanzeige
│
├── database/
│   └── migrations/
│       ├── 001_initial.sql                # Schema + Seed-Daten (10 Immobilien)
│       └── 002_auth.sql                   # Benutzer- + Refresh-Token-Tabellen
│
├── playwright.config.ts                   # Playwright-Konfiguration
├── package.json                           # Root-Workspace-Skripte
└── README.md                              # Diese Datei
```

---



---

<p align="center">
  Erstellt mit ❤️ für das Upwork-Portfolio.
  <br>
  <a href="README.md">Read in English</a> ·
  <a href="README.es.md">Leer en Español</a>
</p>
