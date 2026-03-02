# QuickHire Backend

Backend API for jobs, companies, authentication, and application tracking.

## Stack

- Node.js (ESM)
- Express
- PostgreSQL (`pg`)
- Zod validation

## Features

- Jobs API with search/filter (`search`, `location`, `category`)
- Companies API (profile, employee count, rating, recent hiring)
- Auth with cookie sessions (`register`, `login`, `guest-login`, `logout`)
- Profile update (name + resume link)
- Job applications:
  - anonymous apply
  - logged-in quick apply
  - user submissions (`/api/applications/me`)
  - public tracking URL (`/api/applications/track/:tracking_token`)
- Automatic migrations + seed on startup (configurable)

## Project Structure

```txt
src/
  app.js
  server.js
  config/
  middleware/
  modules/
    auth/
    jobs/
    companies/
    applications/
  database/
    pool.js
    migrations/
      sql/
    seeds/
      data/
```

## Environment

Copy `.env.example` to `.env` and adjust values.

Important keys:

- `DB_PROVIDER=local|neon`
- `LOCAL_DB_*` for local Postgres
- `NEON_DATABASE_URL` for Neon
- `SEED_ON_START=true|false`
- `SEED_FORCE=true|false`
- `SESSION_COOKIE_NAME`
- `SESSION_TTL_DAYS`
- `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`
- `GUEST_USER_EMAIL`, `GUEST_USER_PASSWORD`

## Run

```bash
cd backend
npm install
npm run dev
```

## Database Commands

```bash
npm run db:migrate
npm run db:seed
npm run db:setup
```

`db:setup` runs migrate + seed.

## API Base

- Base: `http://localhost:4000/api`
- Health: `GET /health`
- Ready: `GET /ready`
- Swagger: `GET /api/docs`

- deployed api docs at -> https://quickhire-qtec.onrender.com/api/docs

## Main Endpoints

- Jobs:
  - `GET /api/jobs`
  - `GET /api/jobs/meta`
  - `GET /api/jobs/:id`
  - `POST /api/jobs` (admin)
  - `DELETE /api/jobs/:id` (admin)
- Companies:
  - `GET /api/companies`
  - `GET /api/companies/:slug`
- Auth:
  - `GET /api/auth/demo-account`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/guest-login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `PUT /api/auth/profile`
- Applications:
  - `POST /api/applications`
  - `GET /api/applications/me` (logged in)
  - `GET /api/applications/track/:tracking_token`
