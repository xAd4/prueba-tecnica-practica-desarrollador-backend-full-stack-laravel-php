<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public const CATEGORIES = [
        'Novela',
        'Ciencia ficción',
        'Fantasía',
        'Historia',
        'Tecnología',
        'Poesía',
    ];

    public function run(): void
    {
        foreach (self::CATEGORIES as $name) {
            Category::query()->firstOrCreate(['name' => $name]);
        }
    }
}
