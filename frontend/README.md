# QuickHire Frontend

React + Vite client for QuickHire.

## Stack

- React
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS

## Features

- Jobs list + search/filter
- Job details + application flow
- Companies browsing and company profile pages
- Auth pages (`login`, `register`, `guest mode`)
- Profile page (resume link)
- My Applications page
- Dynamic application status route (`/applications/track/:trackingToken`)

## Setup

```bash
cd frontend
npm install
```

Create `.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ADMIN_API_KEY=dev-admin-key
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Routes

- `/`
- `/jobs`
- `/jobs/:id`
- `/companies`
- `/companies/:slug`
- `/login`
- `/register`
- `/profile`
- `/my-applications`
- `/applications/track/:trackingToken`
- `/admin`
