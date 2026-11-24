<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_blocks_a_client_that_exceeds_the_limit_per_minute(): void
    {
        config(['app.rate_limit.per_minute' => 2]);

        $this->getJson('/books')->assertOk()->assertHeader('X-RateLimit-Limit', 2);
        $this->getJson('/books')->assertOk()->assertHeader('X-RateLimit-Remaining', 0);

        $this->getJson('/books')
            ->assertTooManyRequests()
            ->assertHeader('Retry-After')
            ->assertJsonPath('message', fn (string $message) => str_starts_with($message, 'Demasiadas peticiones.'));
    }

    public function test_write_operations_have_a_stricter_limit(): void
    {
        config([
            'app.rate_limit.per_minute' => 100,
            'app.rate_limit.writes_per_minute' => 1,
        ]);

        $this->postJson('/categories', ['name' => 'Ensayo'])->assertCreated();
        $this->postJson('/categories', ['name' => 'Teatro'])->assertTooManyRequests();

        // Reads are still allowed.
        $this->getJson('/categories')->assertOk();
        $this->assertSame(1, Category::query()->count());
    }

    public function test_the_limit_is_tracked_per_client_ip(): void
    {
        config(['app.rate_limit.per_minute' => 1]);

        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])->getJson('/books')->assertOk();
        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.1'])->getJson('/books')->assertTooManyRequests();
        $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.2'])->getJson('/books')->assertOk();
    }
}
