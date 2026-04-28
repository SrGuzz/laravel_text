<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    // /**
    //  * Determine if the user is authorized to make this request.
    //  */
    // public function authorize(): bool
    // {
    //     return false;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|min:3|max:30|string',
            'description' => 'required|string|min:10|max:255',
            'price' => 'required|numeric|min:0|regex:/^\d+(\.\d{1,2})?$/',
            'quantity' => 'required|integer|min:0'
        ];
    }

    public function messages()
    {
        return [
            '*.required' => 'O campo :attribute é obrigatório.',
            '*.string' => 'O campo :attribute deve ser um texto.',
            '*.numeric' => 'O campo :attribute deve ser um número.',
            '*.integer' => 'O campo :attribute deve ser um número inteiro.',
            '*.min' => 'O campo :attribute deve ser no mínimo :min.',
            '*.max' => 'O campo :attribute deve ser no máximo :max.',

            'preco.regex' => 'O preço deve ter no máximo 2 casas decimais.',
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'nome',
            'description' => 'descrição',
            'price' => 'preço',
            'quantity' => 'quantidade',
        ];
    }
}
