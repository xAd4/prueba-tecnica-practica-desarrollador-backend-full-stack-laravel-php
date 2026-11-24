<?php

namespace App\Services;

use App\Exceptions\BookNotFoundException;
use App\Models\Book;
use App\Repositories\Contracts\BookRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BookService
{
    public function __construct(private readonly BookRepositoryInterface $books) {}

    /**
     * @return Collection<int, Book>
     */
    public function list(?int $categoryId = null): Collection
    {
        return $this->books->all($categoryId);
    }

    /**
     * @throws BookNotFoundException
     */
    public function find(int $id): Book
    {
        return $this->books->findById($id) ?? throw new BookNotFoundException($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Book
    {
        return $this->books->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws BookNotFoundException
     */
    public function update(int $id, array $data): Book
    {
        return $this->books->update($this->find($id), $data);
    }

    /**
     * Verifies that the book exists before deleting it.
     *
     * @throws BookNotFoundException
     */
    public function delete(int $id): void
    {
        $this->books->delete($this->find($id));
    }
}
