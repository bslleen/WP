# Eleanor Ashworth — Writer Portfolio

A dark academia writer portfolio: React + Vite frontend (runs standalone) and a Go REST API backend (connect when ready).

---

## Project Structure

```
writer-portfolio/
├── src/
│   ├── components/     Navigation, Footer, OrnateElements, PasswordModal
│   ├── pages/          Home, Works, About, Journal, Secret
│   ├── hooks/          useSecretAccess (Konami + candle auth)
│   └── data/
│       ├── content.js  Local mock data (used when no API configured)
│       └── api.js      API client (auto-falls back to mock data)
└── backend/
    ├── cmd/server/     Go entry point
    ├── internal/
    │   ├── db/         PostgreSQL + auto-migration
    │   ├── handlers/   Works, Journal, Auth, Upload
    │   ├── middleware/ JWT auth
    │   └── models/     Structs
    ├── .env.example
    └── docker-compose.yml
```

---

## Frontend — Quick Start

```bash
npm install && npm run dev   # http://localhost:5173
```

Runs fully standalone with mock data — no backend needed.

To connect the backend, create `.env.local`:
```
VITE_API_URL=http://localhost:8080
```

---

## Secret Page

Two entry points:

1. **Konami code** anywhere on the site: `↑ ↑ ↓ ↓ ← → ← → B A`
2. **Candle icon** in the top-right of the navigation bar

Default password: **`inkandashes`**

Change it in `src/hooks/useSecretAccess.js` (frontend) and `backend/.env` (backend).

Features inside:
- **Private Journal** — full editor, saved to localStorage
- **Letters to the Future** — seal a message with a reveal date; it stays hidden until that day arrives

---

## Backend — Quick Start

```bash
cd backend
docker-compose up -d          # start Postgres
cp .env.example .env          # fill in JWT_SECRET, OWNER_PASSWORD, Cloudinary
go mod tidy
go run ./cmd/server           # http://localhost:8080
```

Tables are created automatically on first run.

---

## API Reference

### Auth
`POST /api/v1/auth/login` — body `{ "password": "..." }` → `{ "token": "..." }`

Use `Authorization: Bearer <token>` on all protected routes.

### Works (CRUD)
```
GET    /api/v1/works             ?category=novel&status=published
GET    /api/v1/works/:id
POST   /api/v1/works             protected
PUT    /api/v1/works/:id         protected  (partial update)
DELETE /api/v1/works/:id         protected
```
Categories: `novel` · `poetry` · `short story`
Statuses: `published` · `in progress` · `archived`

### Journal (CRUD)
```
GET    /api/v1/journal
GET    /api/v1/journal/:id
POST   /api/v1/journal           protected
PUT    /api/v1/journal/:id       protected
DELETE /api/v1/journal/:id       protected
```

### Image Upload
```
POST /api/v1/upload              protected — multipart/form-data, field "file"
```
Returns `{ "url": "...", "public_id": "..." }`

---

## Design Tokens

```
--deep-black  #0d0a05   background
--dark-brown  #1a1209   cards
--gold        #c9a84c   primary accent
--gold-dim    #8a6d2f   borders, muted gold
--parchment   #f0e6c8   headings
--mist        #6b5a3e   body text
```

Fonts: Playfair Display · IM Fell English · Crimson Text
