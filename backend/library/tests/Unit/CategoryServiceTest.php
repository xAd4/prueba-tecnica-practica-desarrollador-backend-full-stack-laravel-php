<?php

namespace Tests\Unit;

use App\Exceptions\CategoryHasBooksException;
use App\Exceptions\CategoryNotFoundException;
use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Services\CategoryService;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class CategoryServiceTest extends TestCase
{
    private CategoryRepositoryInterface&MockInterface $repository;

    private CategoryService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = Mockery::mock(CategoryRepositoryInterface::class);
        $this->service = new CategoryService($this->repository);
    }

    public function test_delete_fails_when_the_category_has_books(): void
    {
        $category = new Category(['name' => 'Novela']);
        $this->repository->shouldReceive('findById')->once()->with(1)->andReturn($category);
        $this->repository->shouldReceive('hasBooks')->once()->with($category)->andReturnTrue();
        $this->repository->shouldNotReceive('delete');

        $this->expectException(CategoryHasBooksException::class);

        $this->service->delete(1);
    }

    public function test_delete_removes_an_empty_category(): void
    {
        $category = new Category(['name' => 'Novela']);
        $this->repository->shouldReceive('findById')->once()->with(1)->andReturn($category);
        $this->repository->shouldReceive('hasBooks')->once()->with($category)->andReturnFalse();
        $this->repository->shouldReceive('delete')->once()->with($category)->andReturnTrue();

        $this->service->delete(1);
    }

    public function test_delete_fails_when_the_category_does_not_exist(): void
    {
        $this->repository->shouldReceive('findById')->once()->with(9)->andReturnNull();
        $this->repository->shouldNotReceive('hasBooks');

        $this->expectException(CategoryNotFoundException::class);

        $this->service->delete(9);
    }
}
