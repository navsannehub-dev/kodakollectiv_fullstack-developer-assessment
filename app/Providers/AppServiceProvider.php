<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        JsonResource::withoutWrapping();

        if (config('database.default') === 'sqlite') {
            $path = config('database.connections.sqlite.database');

            if (is_string($path) && $path !== ':memory:' && ! file_exists($path)) {
                $directory = dirname($path);

                if (! is_dir($directory)) {
                    mkdir($directory, 0755, true);
                }

                touch($path);
            }
        }
    }
}
