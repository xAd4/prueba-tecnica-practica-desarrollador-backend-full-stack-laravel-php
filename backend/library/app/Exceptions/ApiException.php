<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Base class for domain errors that must be returned to the client as JSON
 * with a specific HTTP status code. Laravel calls render() automatically.
 */
abstract class ApiException extends Exception
{
    abstract public function status(): int;

    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], $this->status());
    }
}
