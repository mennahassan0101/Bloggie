<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // any authenticated user can create a post
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'tags' => 'required|array|min:1',
            'tags.*' => 'required|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'tags.required' => 'A post must have at least one tag.',
            'tags.min' => 'A post must have at least one tag.',
        ];
    }
}