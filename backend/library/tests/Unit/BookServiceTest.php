<?php

namespace Tests\Unit;

use App\Exceptions\BookNotFoundException;
use App\Models\Book;
use App\Repositories\Contracts\BookRepositoryInterface;
use App\Services\BookService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class BookServiceTest extends TestCase
{
    private BookRepositoryInterface&MockInterface $repository;

    private BookService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = Mockery::mock(BookRepositoryInterface::class);
        $this->service = new BookService($this->repository);
    }

    public function test_delete_checks_that_the_book_exists_first(): void
    {
        $this->repository->shouldReceive('findById')->once()->with(10)->andReturnNull();
        $this->repository->shouldNotReceive('delete');

        $this->expectException(BookNotFoundException::class);

        $this->service->delete(10);
    }

    public function test_delete_removes_an_existing_book(): void
    {
        $book = new Book(['title' => 'Dune']);
        $this->repository->shouldReceive('findById')->once()->with(1)->andReturn($book);
        $this->repository->shouldReceive('delete')->once()->with($book)->andReturnTrue();

        $this->service->delete(1);
    }

    public function test_update_fails_when_the_book_does_not_exist(): void
    {
        $this->repository->shouldReceive('findById')->once()->with(5)->andReturnNull();
        $this->repository->shouldNotReceive('update');

        $this->expectException(BookNotFoundException::class);

        $this->service->update(5, ['title' => 'Nuevo']);
    }

    public function test_list_forwards_the_category_filter(): void
    {
        $this->repository->shouldReceive('all')->once()->with(3)
            ->andReturn(new Collection);

        $this->assertCount(0, $this->service->list(3));
    }
}
