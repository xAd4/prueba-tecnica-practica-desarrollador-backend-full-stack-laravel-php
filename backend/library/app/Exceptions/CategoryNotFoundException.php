<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

class CategoryNotFoundException extends ApiException
{
    public function __construct(int $id)
    {
        parent::__construct("La categoría con id {$id} no existe.");
    }

    public function status(): int
    {
        return Response::HTTP_NOT_FOUND;
    }
}
