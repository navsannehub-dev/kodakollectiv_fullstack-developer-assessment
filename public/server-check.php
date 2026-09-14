<?php

header('Content-Type: text/plain; charset=utf-8');

$root = dirname(__DIR__);
$checks = [];

$checks['php_version'] = PHP_VERSION;
$checks['vendor_autoload'] = file_exists($root.'/vendor/autoload.php') ? 'OK' : 'MISSING - run composer install';
$checks['env_file'] = file_exists($root.'/.env') ? 'OK' : 'MISSING - copy .env.example to .env';
$checks['storage_writable'] = is_writable($root.'/storage') ? 'OK' : 'NOT WRITABLE - chmod 775 storage';
$checks['cache_writable'] = is_writable($root.'/bootstrap/cache') ? 'OK' : 'NOT WRITABLE - chmod 775 bootstrap/cache';
$checks['vite_manifest'] = file_exists($root.'/public/build/manifest.json') ? 'OK' : 'MISSING - run npm run build';

$appKey = '';
if (file_exists($root.'/.env')) {
    foreach (file($root.'/.env') as $line) {
        if (str_starts_with(trim($line), 'APP_KEY=')) {
            $appKey = trim(substr(trim($line), 8));
            break;
        }
    }
}
$checks['app_key'] = $appKey !== '' ? 'OK' : 'MISSING - run php artisan key:generate';

$dbConnection = 'sqlite';
$dbDatabase = $root.'/database/database.sqlite';
if (file_exists($root.'/.env')) {
    foreach (file($root.'/.env') as $line) {
        $line = trim($line);
        if (str_starts_with($line, 'DB_CONNECTION=')) {
            $dbConnection = substr($line, 14);
        }
        if (str_starts_with($line, 'DB_DATABASE=') && $dbConnection !== 'sqlite') {
            $dbDatabase = substr($line, 12);
        }
    }
}

$checks['db_connection'] = $dbConnection;

if ($dbConnection === 'sqlite') {
    $checks['sqlite_file'] = file_exists($dbDatabase) ? 'OK ('.$dbDatabase.')' : 'MISSING - run: touch database/database.sqlite';
    try {
        if (file_exists($dbDatabase)) {
            $pdo = new PDO('sqlite:'.$dbDatabase);
            $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);
            $checks['tables'] = $tables ? implode(', ', $tables) : 'NONE - run: php artisan migrate --seed --force';
            $checks['projects_table'] = in_array('projects', $tables, true) ? 'OK' : 'MISSING - run: php artisan migrate --seed --force';
        }
    } catch (Throwable $e) {
        $checks['sqlite_error'] = $e->getMessage();
    }
} else {
    $checks['note'] = 'Using MySQL/other - confirm Hostinger DB credentials in .env and run migrate --seed';
}

echo "PulseDesk server check\n";
echo str_repeat('=', 40)."\n";
foreach ($checks as $key => $value) {
    echo str_pad($key, 20).': '.$value."\n";
}
echo "\nDelete this file after fixing: public/server-check.php\n";
