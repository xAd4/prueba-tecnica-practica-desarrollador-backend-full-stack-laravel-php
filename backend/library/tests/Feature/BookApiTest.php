<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookApiTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'El nombre del viento',
            'author' => 'Patrick Rothfuss',
            'description' => 'Primera jornada de la Crónica del asesino de reyes.',
            'published_year' => 2007,
            'category_id' => Category::factory()->create()->id,
        ], $overrides);
    }

    public function test_it_lists_all_books_with_their_category(): void
    {
        Book::factory()->count(3)->create();

        $this->getJson('/books')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonStructure([
                'data' => [['id', 'title', 'author', 'description', 'published_year', 'category_id', 'category' => ['id', 'name']]],
            ]);
    }

    public function test_it_filters_books_by_category(): void
    {
        $novel = Category::factory()->create();
        $poetry = Category::factory()->create();
        Book::factory()->count(2)->for($novel)->create();
        Book::factory()->count(3)->for($poetry)->create();

        $this->getJson("/books?category={$novel->id}")
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.category', $novel->id)
            ->assertJsonPath('data.0.category_id', $novel->id);
    }

    public function test_filtering_by_a_missing_category_returns_422(): void
    {
        $this->getJson('/books?category=999')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category');
    }

    public function test_filtering_with_a_non_numeric_category_returns_422(): void
    {
        $this->getJson('/books?category=abc')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category');
    }

    public function test_it_shows_a_book(): void
    {
        $book = Book::factory()->create();

        $this->getJson("/books/{$book->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $book->id)
            ->assertJsonPath('data.title', $book->title);
    }

    public function test_showing_a_missing_book_returns_404(): void
    {
        $this->getJson('/books/999')
            ->assertNotFound()
            ->assertJsonPath('message', 'El libro con id 999 no existe.');
    }

    public function test_it_creates_a_book(): void
    {
        $payload = $this->validPayload();

        $this->postJson('/books', $payload)
            ->assertCreated()
            ->assertJsonPath('message', 'Libro creado correctamente.')
            ->assertJsonPath('data.title', $payload['title'])
            ->assertJsonPath('data.category.id', $payload['category_id']);

        $this->assertDatabaseHas('books', ['title' => $payload['title'], 'author' => $payload['author']]);
    }

    public function test_description_is_optional(): void
    {
        $this->postJson('/books', $this->validPayload(['description' => null]))
            ->assertCreated()
            ->assertJsonPath('data.description', null);
    }

    public function test_it_requires_the_mandatory_fields(): void
    {
        $this->postJson('/books', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'author', 'published_year', 'category_id']);
    }

    public function test_title_must_have_at_least_three_characters(): void
    {
        $this->postJson('/books', $this->validPayload(['title' => 'ab']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title' => 'al menos 3 caracteres']);
    }

    public function test_published_year_must_be_a_valid_year(): void
    {
        $this->postJson('/books', $this->validPayload(['published_year' => 'abc']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('published_year');

        $this->postJson('/books', $this->validPayload(['published_year' => (int) date('Y') + 1]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('published_year');

        $this->postJson('/books', $this->validPayload(['published_year' => 99]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('published_year');
    }

    public function test_category_must_exist(): void
    {
        $this->postJson('/books', $this->validPayload(['category_id' => 999]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['category_id' => 'no existe']);
    }

    public function test_it_updates_a_book(): void
    {
        $book = Book::factory()->create();
        $payload = $this->validPayload(['title' => 'Título actualizado']);

        $this->putJson("/books/{$book->id}", $payload)
            ->assertOk()
            ->assertJsonPath('message', 'Libro actualizado correctamente.')
            ->assertJsonPath('data.title', 'Título actualizado')
            ->assertJsonPath('data.category_id', $payload['category_id']);

        $this->assertDatabaseHas('books', ['id' => $book->id, 'title' => 'Título actualizado']);
    }

    public function test_updating_validates_the_payload(): void
    {
        $book = Book::factory()->create();

        $this->putJson("/books/{$book->id}", ['title' => 'x'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'author', 'published_year', 'category_id']);
    }

    public function test_updating_a_missing_book_returns_404(): void
    {
        $this->putJson('/books/999', $this->validPayload())->assertNotFound();
    }

    public function test_it_deletes_a_book(): void
    {
        $book = Book::factory()->create();

        $this->deleteJson("/books/{$book->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Libro eliminado correctamente.');

        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }

    public function test_deleting_a_missing_book_returns_404(): void
    {
        $this->deleteJson('/books/999')
            ->assertNotFound()
            ->assertJsonPath('message', 'El libro con id 999 no existe.');
    }

    public function test_unknown_routes_return_json_404(): void
    {
        $this->getJson('/books/not-a-number')
            ->assertNotFound()
            ->assertJsonPath('message', 'Recurso no encontrado.');
    }
}
