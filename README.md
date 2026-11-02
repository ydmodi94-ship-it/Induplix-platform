# Induplix — Digital Operations Partner

> Make Your Business Operations Work Smarter for Chemical, Engineering, and Manufacturing Businesses in Gujarat.

This repository contains the full codebase for Induplix, structured with a modular Node.js API backend and a React + Vite Lovable frontend.

---

## 1. Project Architecture

- **Backend (`Backend/node-api/`)**:
  - Node.js LTS + Express + TypeScript modular monolith.
  - MongoDB + Mongoose connected to your MongoDB Atlas cluster.
  - 18 REST endpoints covering Public Services & Inquiries, Staff Authentication, CSRF protection, and Admin Management.
  - Server-side sessions stored in MongoDB with HttpOnly cookies, session rotation, and CSRF token validation.
  - OpenAPI 3.0 specification & Postman collection included.
- **Frontend (`Frontend/induplix-source/`)**:
  - React + TanStack Router + Vite + Tailwind CSS.
  - Kept intact and clean in its dedicated directory. The public contact form can operate in mock preview mode or connect cleanly to `/api` proxies.

---

## 2. Environment Configuration

### Backend Setup (`Backend/node-api/.env`)
Create a `.env` file in `Backend/node-api/` based on [`.env.example`](file:///c:/Users/ydmod/OneDrive/Desktop/Freelancing/Induplix/Backend/node-api/.env.example):

```env
NODE_ENV=development
PORT=5000
APP_BASE_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
SESSION_SECRET=a-very-secure-random-string-at-least-32-chars-long
SESSION_NAME=induplix.sid
SESSION_MAX_AGE_MS=86400000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_PUBLIC=100
RATE_LIMIT_MAX_AUTH=10
```

> **Security Note**: Never commit your real `.env` file. It is ignored by Git in `.gitignore`.

---

## 3. How to Run the Backend

```bash
cd Backend/node-api

# Install dependencies (already completed)
npm install

# Seed the initial staff administrator account
npm run seed

# Run the test suite (all 23 tests pass)
npm test

# Build TypeScript to production JavaScript
npm run build

# Start the development server (with auto-reload)
npm run dev

# Or start the production build
npm start
```

### Initial Administrator Account (from seed)
- **Email**: `admin@induplix.com`
- **Password**: `InduplixAdmin2026!`
- **Role**: `owner_admin`

---

## 4. API Documentation & OpenAPI Swagger UI

Once the backend is running (`http://localhost:5000`):
- **Interactive Swagger UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **OpenAPI 3.0 YAML Spec**: [`Backend/node-api/src/docs/openapi.yaml`](file:///c:/Users/ydmod/OneDrive/Desktop/Freelancing/Induplix/Backend/node-api/src/docs/openapi.yaml)
- **Postman Collection**: [`Backend/node-api/src/docs/postman_collection.json`](file:///c:/Users/ydmod/OneDrive/Desktop/Freelancing/Induplix/Backend/node-api/src/docs/postman_collection.json)

---

## 5. Phase 1 Route Inventory (18 Endpoints)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | System liveness and uptime check |
| `GET` | `/api/v1/public/services` | Public | List of 4 offered Induplix services |
| `GET` | `/api/v1/public/services/:slug` | Public | Detailed service specs & workflows |
| `POST` | `/api/v1/public/inquiries` | Public (Rate-limited) | Validated inquiry submission |
| `POST` | `/api/v1/public/contact` | Public (Rate-limited) | Lovable contact form payload intake |
| `GET` | `/api/v1/auth/csrf` | Public / Session | Retrieve CSRF token |
| `POST` | `/api/v1/auth/login` | Public (Throttled) | Verify Argon2 password & issue session |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revoke session & clear HttpOnly cookie |
| `GET` | `/api/v1/auth/me` | Authenticated | Current staff user context & role |
| `GET` | `/api/v1/admin/inquiries` | Authenticated | Paginated inquiry list with search & filter |
| `GET` | `/api/v1/admin/inquiries/:id` | Authenticated | Single inquiry details |
| `PATCH` | `/api/v1/admin/inquiries/:id` | Authenticated + CSRF | Update notes, assignment, or status |
| `PATCH` | `/api/v1/admin/inquiries/:id/status` | Authenticated + CSRF | Fast status update (`new`, `in_review`, `qualified`, etc.) |
| `DELETE` | `/api/v1/admin/inquiries/:id` | `owner_admin` + CSRF | Delete inquiry record |
| `GET` | `/api/v1/admin/dashboard/summary` | Authenticated | Aggregate pipeline statistics & metrics |
| `GET` | `/api/v1/admin/dashboard/recent-inquiries` | Authenticated | 10 most recent inquiries for quick review |
| `GET` | `/api/v1/admin/tenants` | Authenticated | List registered client tenants |
| `POST` | `/api/v1/admin/tenants` | `owner_admin` + CSRF | Create tenant entity for Phase 2/3 operations |

---

## 6. How to Run the Frontend

The Lovable frontend remains isolated in `Frontend/induplix-source/`:

```bash
cd Frontend/induplix-source

# Install frontend dependencies
bun install   # or npm install

# Start development server
bun run dev   # or npm run dev
```

The contact form is currently in safe preview mock mode. When you are ready to connect it live, set:
```env
VITE_API_BASE_URL=http://localhost:5000
```
in your frontend `.env` file, and point `submitInquiry` to `/api/v1/public/contact`.

---

## 7. Architecture Document Conflict Log

In accordance with the latest user-approved architecture decisions:
1. **Scope Phase Shift**: Earlier architecture drafts marked staff login, sessions, CSRF, and admin inquiry management as Phase 2. The latest approved scope brought staff authentication and private admin APIs directly into Phase 1 to allow immediate internal inquiry management.
2. **Tenant Scoping**: Phase 1 inquiries are Induplix-owned leads (`tenantId` is `null`/omitted). The `tenants` collection and routes are implemented to allow clean scaling into Phase 2/3 without rebuilding the database.
3. **OpenAPI & Postman**: Full OpenAPI 3.0 YAML spec and Postman collection are synchronized and stored in `Backend/node-api/src/docs/`.

