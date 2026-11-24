<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database. Seeders are idempotent.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            BookSeeder::class,
        ]);
    }
}
