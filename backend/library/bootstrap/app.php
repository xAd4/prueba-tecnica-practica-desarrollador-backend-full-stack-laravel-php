<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        // The challenge defines the endpoints at the root: GET /books, POST /books...
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // The API runs behind the frontend's Nginx reverse proxy.
        $middleware->trustProxies(at: '*');

        // Rate limiting for every API route ("api" limiter in AppServiceProvider).
        $middleware->throttleApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // API-only application: always answer with JSON.
        $exceptions->shouldRenderJsonWhen(fn (Request $request, Throwable $e) => true);

        $exceptions->render(fn (NotFoundHttpException $e, Request $request) => response()->json(
            ['message' => 'Recurso no encontrado.'],
            404,
        ));

        $exceptions->render(fn (MethodNotAllowedHttpException $e, Request $request) => response()->json(
            ['message' => 'Método HTTP no permitido para esta ruta.'],
            405,
        ));
    })->create();
