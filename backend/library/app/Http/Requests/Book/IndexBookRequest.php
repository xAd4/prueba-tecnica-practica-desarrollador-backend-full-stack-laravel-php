<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class IndexBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category' => ['bail', 'nullable', 'integer', 'exists:categories,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category.integer' => 'El filtro de categoría debe ser un número entero.',
            'category.exists' => 'La categoría seleccionada no existe.',
        ];
    }

    public function categoryId(): ?int
    {
        return $this->filled('category') ? $this->integer('category') : null;
    }
}
