<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // any authenticated user can comment on any post
    }

    public function rules(): array
    {
        return [
            'body' => 'required|string|max:2000',
        ];
    }
}