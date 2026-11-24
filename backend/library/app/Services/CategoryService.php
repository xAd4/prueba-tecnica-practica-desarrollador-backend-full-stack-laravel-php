<?php

namespace App\Services;

use App\Exceptions\CategoryHasBooksException;
use App\Exceptions\CategoryNotFoundException;
use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function __construct(private readonly CategoryRepositoryInterface $categories) {}

    /**
     * @return Collection<int, Category>
     */
    public function list(): Collection
    {
        return $this->categories->all();
    }

    /**
     * @throws CategoryNotFoundException
     */
    public function find(int $id): Category
    {
        return $this->categories->findById($id) ?? throw new CategoryNotFoundException($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Category
    {
        return $this->categories->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     *
     * @throws CategoryNotFoundException
     */
    public function update(int $id, array $data): Category
    {
        return $this->categories->update($this->find($id), $data);
    }

    /**
     * A category can only be deleted when it has no books associated.
     *
     * @throws CategoryNotFoundException
     * @throws CategoryHasBooksException
     */
    public function delete(int $id): void
    {
        $category = $this->find($id);

        if ($this->categories->hasBooks($category)) {
            throw new CategoryHasBooksException($category->name);
        }

        $this->categories->delete($category);
    }
}
