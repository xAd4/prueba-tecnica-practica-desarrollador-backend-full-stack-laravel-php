<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private readonly Category $model) {}

    public function all(): Collection
    {
        return $this->model->newQuery()
            ->withCount('books')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id): ?Category
    {
        return $this->model->newQuery()->withCount('books')->find($id);
    }

    public function create(array $data): Category
    {
        $category = $this->model->newQuery()->create($data);

        return $category->loadCount('books');
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);

        return $category->refresh()->loadCount('books');
    }

    public function delete(Category $category): bool
    {
        return (bool) $category->delete();
    }

    public function hasBooks(Category $category): bool
    {
        return $category->books()->exists();
    }
}
