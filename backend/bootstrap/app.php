<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS is handled automatically by Laravel when config/cors.php exists
        
        // Add API response middleware
        $middleware->api(append: [
            \App\Http\Middleware\ApiResponseMiddleware::class,
        ]);
        
        $middleware->alias([
            'super_admin' => App\Http\Middleware\EnsureSuperAdmin::class,
            'role' => App\Http\Middleware\EnsureRole::class,
            'web.role' => App\Http\Middleware\EnsureWebRole::class,
        ]);

        // Web pages: send guests to the login page, and signed-in users away from login/register
        $middleware->redirectGuestsTo(fn () => route('login'));
        $middleware->redirectUsersTo(fn () => auth()->user()?->isAdmin() ? route('admin.dashboard') : route('student.dashboard'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
