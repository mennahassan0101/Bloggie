<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostTagsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('post'));
    }

    public function rules(): array
    {
        return [
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