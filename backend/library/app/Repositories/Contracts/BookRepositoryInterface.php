<?php

namespace App\Repositories\Contracts;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;

interface BookRepositoryInterface
{
    /**
     * @return Collection<int, Book>
     */
    public function all(?int $categoryId = null): Collection;

    public function findById(int $id): ?Book;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Book;

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Book $book, array $data): Book;

    public function delete(Book $book): bool;
}
