<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * @var list<array{title: string, author: string, description: string|null, published_year: int, category: string}>
     */
    private const BOOKS = [
        ['title' => 'Cien años de soledad', 'author' => 'Gabriel García Márquez', 'description' => 'La historia de la familia Buendía en el pueblo de Macondo.', 'published_year' => 1967, 'category' => 'Novela'],
        ['title' => 'Don Quijote de la Mancha', 'author' => 'Miguel de Cervantes', 'description' => 'Las aventuras del ingenioso hidalgo y su escudero Sancho Panza.', 'published_year' => 1605, 'category' => 'Novela'],
        ['title' => 'Dune', 'author' => 'Frank Herbert', 'description' => 'Intriga política y ecológica en el planeta desértico Arrakis.', 'published_year' => 1965, 'category' => 'Ciencia ficción'],
        ['title' => 'Fundación', 'author' => 'Isaac Asimov', 'description' => 'La psicohistoria intenta salvar a la humanidad de una larga edad oscura.', 'published_year' => 1951, 'category' => 'Ciencia ficción'],
        ['title' => 'El Hobbit', 'author' => 'J. R. R. Tolkien', 'description' => 'Bilbo Bolsón emprende un viaje inesperado junto a trece enanos.', 'published_year' => 1937, 'category' => 'Fantasía'],
        ['title' => 'Sapiens', 'author' => 'Yuval Noah Harari', 'description' => 'Una breve historia de la humanidad.', 'published_year' => 2011, 'category' => 'Historia'],
        ['title' => 'Clean Code', 'author' => 'Robert C. Martin', 'description' => 'Manual de buenas prácticas para escribir código mantenible.', 'published_year' => 2008, 'category' => 'Tecnología'],
        ['title' => 'Veinte poemas de amor y una canción desesperada', 'author' => 'Pablo Neruda', 'description' => null, 'published_year' => 1924, 'category' => 'Poesía'],
    ];

    public function run(): void
    {
        $categories = Category::query()->pluck('id', 'name');

        foreach (self::BOOKS as $book) {
            $categoryId = $categories[$book['category']] ?? null;

            if ($categoryId === null) {
                continue;
            }

            Book::query()->firstOrCreate(
                ['title' => $book['title'], 'author' => $book['author']],
                [
                    'description' => $book['description'],
                    'published_year' => $book['published_year'],
                    'category_id' => $categoryId,
                ],
            );
        }
    }
}
