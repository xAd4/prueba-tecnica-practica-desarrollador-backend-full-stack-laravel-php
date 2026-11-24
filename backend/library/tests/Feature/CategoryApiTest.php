<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_categories_with_their_books_count(): void
    {
        $category = Category::factory()->create(['name' => 'Novela']);
        Book::factory()->count(2)->for($category)->create();

        $this->getJson('/categories')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Novela')
            ->assertJsonPath('data.0.books_count', 2);
    }

    public function test_it_creates_a_category(): void
    {
        $this->postJson('/categories', ['name' => '  Ensayo  '])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Ensayo')
            ->assertJsonPath('data.books_count', 0);

        $this->assertDatabaseHas('categories', ['name' => 'Ensayo']);
    }

    public function test_category_name_is_required(): void
    {
        $this->postJson('/categories', ['name' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_category_name_must_be_unique(): void
    {
        Category::factory()->create(['name' => 'Novela']);

        $this->postJson('/categories', ['name' => 'Novela'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name' => 'Ya existe una categoría con ese nombre.']);
    }

    public function test_it_updates_a_category_keeping_its_own_name(): void
    {
        $category = Category::factory()->create(['name' => 'Novela']);

        $this->putJson("/categories/{$category->id}", ['name' => 'Novela'])->assertOk();

        $this->putJson("/categories/{$category->id}", ['name' => 'Novela negra'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Novela negra');
    }

    public function test_updating_to_an_existing_name_fails(): void
    {
        Category::factory()->create(['name' => 'Novela']);
        $other = Category::factory()->create(['name' => 'Poesía']);

        $this->putJson("/categories/{$other->id}", ['name' => 'Novela'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_it_deletes_a_category_without_books(): void
    {
        $category = Category::factory()->create();

        $this->deleteJson("/categories/{$category->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Categoría eliminada correctamente.');

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_it_does_not_delete_a_category_with_books(): void
    {
        $category = Category::factory()->create(['name' => 'Novela']);
        Book::factory()->for($category)->create();

        $this->deleteJson("/categories/{$category->id}")
            ->assertConflict()
            ->assertJsonPath('message', 'No se puede eliminar la categoría "Novela" porque tiene libros asociados.');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_deleting_a_missing_category_returns_404(): void
    {
        $this->deleteJson('/categories/999')->assertNotFound();
    }
}
