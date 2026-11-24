<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * "api" rate limiter, applied to every API route (see bootstrap/app.php).
     *
     * Each client (IP) has a global limit per minute and a stricter one for
     * write operations, so nobody can massively consume the endpoints.
     * Exceeding it returns 429 with the Retry-After / X-RateLimit-* headers.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request): array {
            $clientKey = $request->ip() ?? 'unknown';

            $limits = [
                Limit::perMinute(config('app.rate_limit.per_minute'))
                    ->by('api:'.$clientKey)
                    ->response($this->tooManyRequestsResponse(...)),
            ];

            if (! $request->isMethodSafe()) {
                $limits[] = Limit::perMinute(config('app.rate_limit.writes_per_minute'))
                    ->by('api-writes:'.$clientKey)
                    ->response($this->tooManyRequestsResponse(...));
            }

            return $limits;
        });
    }

    /**
     * @param  array<string, mixed>  $headers
     */
    private function tooManyRequestsResponse(Request $request, array $headers): JsonResponse
    {
        $retryAfter = (int) ($headers['Retry-After'] ?? 60);

        return response()->json([
            'message' => "Demasiadas peticiones. Inténtalo de nuevo en {$retryAfter} segundos.",
        ], 429, $headers);
    }
}
