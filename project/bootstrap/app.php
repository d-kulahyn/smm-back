<?php

use App\Infrastructure\Exception\ApiExceptionHandler;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Add CORS middleware for API routes
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Register custom CORS middleware
        $middleware->alias([
            'cors' => \App\Infrastructure\API\Middleware\Cors::class,
        ]);

        // Configure CORS
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withEvents(discover: [
        __DIR__.'/../app/Application/Listener'
    ])
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, Request $request) {
            $handler = new ApiExceptionHandler();

            return $handler->handle($e, $request);
        });
    })->create();
