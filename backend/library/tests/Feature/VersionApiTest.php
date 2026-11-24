<?php

namespace Tests\Feature;

use Tests\TestCase;

class VersionApiTest extends TestCase
{
    public function test_it_returns_the_backend_version(): void
    {
        config(['app.version' => '1.0.7']);

        $this->getJson('/version')
            ->assertOk()
            ->assertJsonPath('data.version', '1.0.7')
            ->assertJsonPath('data.name', config('app.name'));
    }
}
