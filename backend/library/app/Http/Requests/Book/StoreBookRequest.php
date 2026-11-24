<?php

namespace App\Http\Requests\Book;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
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
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'published_year' => ['required', 'integer', 'min:1000', 'max:'.now()->year],
            'category_id' => ['bail', 'required', 'integer', 'exists:categories,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.min' => 'El título debe tener al menos :min caracteres.',
            'title.max' => 'El título no puede superar los :max caracteres.',
            'author.required' => 'El autor es obligatorio.',
            'author.max' => 'El autor no puede superar los :max caracteres.',
            'description.string' => 'La descripción debe ser texto.',
            'published_year.required' => 'El año de publicación es obligatorio.',
            'published_year.integer' => 'El año de publicación debe ser un número entero.',
            'published_year.min' => 'El año de publicación debe ser mayor o igual a :min.',
            'published_year.max' => 'El año de publicación no puede ser posterior a :max.',
            'category_id.required' => 'La categoría es obligatoria.',
            'category_id.integer' => 'La categoría debe ser un identificador válido.',
            'category_id.exists' => 'La categoría seleccionada no existe.',
        ];
    }
}
