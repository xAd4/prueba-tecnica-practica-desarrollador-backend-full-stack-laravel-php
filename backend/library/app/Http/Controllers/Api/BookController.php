<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\IndexBookRequest;
use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class BookController extends Controller
{
    public function __construct(private readonly BookService $bookService) {}

    /**
     * GET /books  and  GET /books?category={category_id}
     */
    public function index(IndexBookRequest $request): AnonymousResourceCollection
    {
        $books = $this->bookService->list($request->categoryId());

        return BookResource::collection($books)->additional([
            'meta' => [
                'total' => $books->count(),
                'category' => $request->categoryId(),
            ],
        ]);
    }

    public function show(int $id): BookResource
    {
        return new BookResource($this->bookService->find($id));
    }

    public function store(StoreBookRequest $request): JsonResponse
    {
        $book = $this->bookService->create($request->validated());

        return (new BookResource($book))
            ->additional(['message' => 'Libro creado correctamente.'])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateBookRequest $request, int $id): BookResource
    {
        $book = $this->bookService->update($id, $request->validated());

        return (new BookResource($book))
            ->additional(['message' => 'Libro actualizado correctamente.']);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->bookService->delete($id);

        return response()->json(['message' => 'Libro eliminado correctamente.']);
    }
}
