# Client Project Tracker

Single Next.js app with REST API and UI in one project (no separate frontend/backend folders).

## Stack

- Next.js (App Router)
- React
- Prisma
- SQLite

## Prerequisites

- Node.js 20+
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create the environment file:

```bash
cp .env.example .env
```

The default database URL is SQLite:

```
DATABASE_URL="file:./dev.db"
```

3. Apply migrations and generate the Prisma client:

```bash
npx prisma migrate dev
```

4. Seed sample projects (optional):

```bash
npm run seed
```

## Run

Start the development server:

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start the production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:reset` | Reset the database and re-run migrations |
| `npm run seed` | Insert sample projects |
| `npm run lint` | Run ESLint |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects |
| GET | `/projects/:id` | Get one project |
| POST | `/projects` | Create project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

### Query params for `GET /projects`

- `search` — client name, project name, or description
- `status` — Planning | In Progress | On Hold | Completed
- `priority` — Low | Medium | High
- `sort` — dueDate | startDate | clientName | projectName | priority | status | createdAt
- `order` — asc | desc

### Example create body

```json
{
  "clientName": "Acme Co",
  "projectName": "Website Redesign",
  "description": "Marketing site refresh",
  "status": "Planning",
  "priority": "High",
  "startDate": "2026-09-11",
  "dueDate": "2026-10-30"
}
```

## Validation

- Client Name required
- Project Name required
- Status must be valid
- Priority must be valid
- Due Date cannot be earlier than Start Date
