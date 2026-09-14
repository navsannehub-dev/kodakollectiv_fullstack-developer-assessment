<?php

header('Content-Type: text/plain; charset=utf-8');

$root = dirname(__DIR__);
$token = $_GET['token'] ?? '';

$envPath = $root.'/.env';
if (! file_exists($envPath)) {
    http_response_code(500);
    echo "Missing .env file.\n";
    exit;
}

$envContents = file_get_contents($envPath);
$setupToken = '';
if (preg_match('/^SETUP_TOKEN=(.*)$/m', $envContents, $match)) {
    $setupToken = trim($match[1], " \t\"'");
}

if ($setupToken === '' || ! hash_equals($setupToken, (string) $token)) {
    http_response_code(404);
    echo "Not found.\n";
    exit;
}

$lines = [];
$lines[] = 'PulseDesk one-click setup';
$lines[] = str_repeat('=', 40);

if (! preg_match('/^APP_KEY=.+/m', $envContents) || preg_match('/^APP_KEY=\s*$/m', $envContents)) {
    $key = 'base64:'.base64_encode(random_bytes(32));
    if (preg_match('/^APP_KEY=.*$/m', $envContents)) {
        $envContents = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY='.$key, $envContents, 1);
    } else {
        $envContents .= PHP_EOL.'APP_KEY='.$key.PHP_EOL;
    }
    file_put_contents($envPath, $envContents);
    $lines[] = 'APP_KEY generated.';
} else {
    $lines[] = 'APP_KEY already set.';
}

$sqlite = $root.'/database/database.sqlite';
if (! file_exists($sqlite)) {
    if (! is_dir(dirname($sqlite))) {
        mkdir(dirname($sqlite), 0755, true);
    }
    touch($sqlite);
    $lines[] = 'Created database.sqlite';
} else {
    $lines[] = 'database.sqlite exists.';
}

require $root.'/vendor/autoload.php';
$app = require $root.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$statusMigrate = $kernel->call('migrate', ['--force' => true]);
$lines[] = 'migrate status: '.$statusMigrate;
$lines[] = trim($kernel->output());

$statusSeed = $kernel->call('db:seed', ['--force' => true]);
$lines[] = 'seed status: '.$statusSeed;
$lines[] = trim($kernel->output());

$lines[] = '';
$lines[] = 'Done.';
$lines[] = '1) Open / and confirm the app loads';
$lines[] = '2) Remove SETUP_TOKEN from .env';
$lines[] = '3) Delete public/one-click-setup.php and public/server-check.php';

echo implode("\n", $lines)."\n";
