<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class CategoryHasBooksException extends ApiException
{
    public function __construct(string $categoryName)
    {
        parent::__construct("No se puede eliminar la categoría \"{$categoryName}\" porque tiene libros asociados.");
    }

    public function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
