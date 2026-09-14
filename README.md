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

### Development

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Open http://127.0.0.1:8000

### Production assets

```bash
npm run build
php artisan serve
```

Compiled files are in `public/build` (already included in the repo).

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

## Hostinger deploy

1. Point the domain document root to the `public` folder  
   **or** keep the repo root `.htaccess` that routes into `public`.
2. On the server:

```bash
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed --force
chmod -R 775 storage bootstrap/cache
```

3. Set in `.env`:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://kodakollectiv.navsanneworks.com
```

4. Make sure `vendor/` exists on the server (`composer install`). Without it Laravel returns 500.

5. Open https://your-domain/server-check.php to see what is missing.

6. Add `SETUP_TOKEN=your-secret` to `.env`, then open:

```
https://your-domain/__setup?token=your-secret
```

That runs migrate + seed once. Remove `SETUP_TOKEN` after.
