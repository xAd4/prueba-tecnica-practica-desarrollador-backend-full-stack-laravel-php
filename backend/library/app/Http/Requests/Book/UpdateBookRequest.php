<?php

namespace App\Http\Requests\Book;

/**
 * PUT replaces the whole resource, so it shares the store rules.
 */
class UpdateBookRequest extends StoreBookRequest {}
