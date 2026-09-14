# Client Project Tracker

Single Laravel app with React + Tailwind (no separate frontend/backend folders, no Vercel).

## Stack

- Laravel
- React
- Tailwind CSS
- SQLite (default) or MySQL

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
npm install
```

## Run

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Open http://127.0.0.1:8000

## MySQL (optional)

In `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_tracker
DB_USERNAME=root
DB_PASSWORD=
```

Then:

```bash
php artisan migrate --seed
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects |
| GET | `/projects/{id}` | Get one project |
| POST | `/projects` | Create project |
| PUT | `/projects/{id}` | Update project |
| DELETE | `/projects/{id}` | Delete project |

### Query params for `GET /projects`

- `search`
- `status`
- `priority`
- `sort`
- `order`

## Validation

- Client Name required
- Project Name required
- Status must be valid
- Priority must be valid
- Due Date cannot be earlier than Start Date
