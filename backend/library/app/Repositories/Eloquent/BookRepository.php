<?php

namespace App\Repositories\Eloquent;

use App\Models\Book;
use App\Repositories\Contracts\BookRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BookRepository implements BookRepositoryInterface
{
    public function __construct(private readonly Book $model) {}

    public function all(?int $categoryId = null): Collection
    {
        return $this->model->newQuery()
            ->with('category')
            ->when($categoryId !== null, fn ($query) => $query->where('category_id', $categoryId))
            ->latest('id')
            ->get();
    }

    public function findById(int $id): ?Book
    {
        return $this->model->newQuery()->with('category')->find($id);
    }

    public function create(array $data): Book
    {
        $book = $this->model->newQuery()->create($data);

        return $book->load('category');
    }

    public function update(Book $book, array $data): Book
    {
        $book->update($data);

        return $book->refresh()->load('category');
    }

    public function delete(Book $book): bool
    {
        return (bool) $book->delete();
    }
}
