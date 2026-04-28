<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:100'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'min_quantity' => ['nullable', 'integer', 'min:0'],
            'max_quantity' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            '*.string' => 'O campo :attribute deve ser um texto.',
            '*.numeric' => 'O campo :attribute mínimo deve ser numérico.',
            '*.integer' => 'O campo :attribute mínima deve ser um número inteiro.',
            '*.min' => 'O campo :attribute deve ser no mínimo :min.',
            '*.max' => 'O campo :attribute deve ser no máximo :max.',
        ];
    }
}
