# DNX FITNEST

**Train Hard. Stay Strong. Become Better.**

A responsive gym membership and member-management app with a React/Vite frontend, Express REST API, Prisma ORM, and PostgreSQL schema. The public website and member portal include a browser-based demo mode, so the frontend can be explored without configuring a database.

## Project structure

```text
client/
  src/api/            API client
  src/components/     Reusable UI components (expandable)
  src/contexts/       Authentication context
  src/layouts/        Member navigation and shell
  src/pages/          Public, auth, dashboard, and member pages
  src/types/          Shared frontend types
server/
  prisma/schema.prisma
  prisma/seed.ts
  src/config/         Environment and Prisma clients
  src/middleware/     JWT auth, roles, errors
  src/routes/         REST API endpoints
  src/utils/          JWT helpers
.env.example
```

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+
- PostgreSQL 14+ for database-backed API features

## Install

From the workspace root:

```powershell
npm install
```

## PostgreSQL and environment

Create a PostgreSQL database named `dnx_fitnest` (or update the URL to your chosen database). For a local PostgreSQL installation, create the database in `psql` or pgAdmin:

```sql
CREATE DATABASE dnx_fitnest;
```

Copy `.env.example` to `server/.env`, then set `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`. Use two different random secrets of at least 32 characters. `CLIENT_ORIGIN` should match the Vite origin.

For the frontend to call the API, create `client/.env.local`:

```env
VITE_API_URL=http://localhost:4000
```

When `VITE_API_URL` is absent, authentication and demo interactions use browser-local demo state. No real payment or card data is processed.

## Database setup

From the workspace root:

```powershell
npm run db:generate
npm run db:migrate -w server -- --name init
npm run db:seed
```

The seed creates 10 members, 5 trainers, 20 attendance records, 10 payments, 10 workout plans, 20 exercises, 5 diet plans, 10 notifications, 10 announcements, and 5 support tickets.

## Run

Run both development servers from the workspace root:

```powershell
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/health

Run separately if preferred:

```powershell
npm run dev -w client
npm run dev -w server
```

Build both applications:

```powershell
npm run build
```

## Demo account

- Email: `demo@dnxfitnest.com`
- Password: `Demo@123`

Seed this account into PostgreSQL using `npm run db:seed`. Without a configured API, the same credentials open the local browser demo.

## Implemented areas

- Public gym home page with membership plans, coach information, and responsive navigation.
- Member dashboard with attendance, membership, workout, trainer, and quick-action summaries.
- Registration/login with React Hook Form and Zod; API mode issues JWT access and refresh tokens.
- Member pages for profile/settings, plans and demo checkout, attendance check-in/out, workout completion, exercise search/filtering, nutrition, progress charts, measurements, trainer, payments/receipts, notifications, announcements, and support tickets.
- REST endpoints under `/api` for authentication and member data, guarded by JWT middleware where appropriate.
- PostgreSQL Prisma models, indexes, relations, enums, and deterministic demo seed data.
- Helmet, CORS allowlisting, request rate limiting, Zod request validation, bcrypt password hashing, and role authorization middleware.

## API routes

Authentication: `POST /api/auth/register`, `/login`, `/forgot-password`, `/reset-password`, `/refresh`.
Member: `GET/PUT /api/member/profile`, `GET /api/member/dashboard`.
Membership and payments: `GET /api/membership`, `GET /api/membership/plans`, `POST /api/membership/select`, `GET/POST /api/payments`, `POST /api/payments/verify` (Razorpay signature checked before activation).
Attendance: `GET /api/attendance`, `POST /api/attendance/check-in`, `/check-out`.
Training: `GET /api/workouts`, `/workouts/today`, `PUT /api/workouts/:id/complete`, `GET /api/exercises`, `GET /api/diet`, `GET/POST /api/progress`, `GET /api/trainer`.
Community: `GET /api/notifications`, `PUT /api/notifications/:id/read`, `GET /api/announcements`, `GET/POST /api/support/tickets`, `GET /api/support/tickets/:id`.

## Configuration notes

`PAYMENT_MODE=demo` is the default. The UI never collects or stores card information. Razorpay credentials are optional placeholders in `.env.example`; live checkout and webhook verification must be enabled before accepting real payments. Password-reset email delivery and Cloudinary uploads require provider credentials and are not enabled in demo mode. The local browser demo persists member actions in `localStorage`; database-backed routes require PostgreSQL and API configuration.

The current member-page interactions (attendance, workout checkboxes, notifications, tickets, measurements, and demo receipts) persist in browser `localStorage`. Login and registration can call the API when `VITE_API_URL` is configured; the other member-page screens are not yet wired to load/save through those REST routes.

`npm audit` currently reports a high-severity advisory in Prisma's transitive `deepmerge-ts` package. The suggested forced automatic fix downgrades Prisma, so dependencies were left at their compatible Prisma 6 release rather than applying a breaking downgrade. Recheck the Prisma dependency tree before deploying.
