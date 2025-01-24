<?php

namespace Backend\Requests;

class StoreImageRequest extends Request
{
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'maxSize:5000'],
            'user_id' => ['required', 'exists:users,id']
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}