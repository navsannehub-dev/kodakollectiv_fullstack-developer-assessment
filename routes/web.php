<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::view('/', 'app');

Route::get('/__setup', function () {
    $token = (string) config('app.setup_token', env('SETUP_TOKEN'));

    if ($token === '' || request('token') !== $token) {
        abort(404);
    }

    Artisan::call('migrate', ['--force' => true]);
    $migrate = Artisan::output();

    Artisan::call('db:seed', ['--force' => true]);
    $seed = Artisan::output();

    return response(
        "Migrate:\n{$migrate}\nSeed:\n{$seed}\nDone. Remove SETUP_TOKEN from .env after this.",
        200,
        ['Content-Type' => 'text/plain; charset=utf-8']
    );
});
