<?php

namespace Backend\Requests;

class StoreImageRequest extends Request
{
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'maxSize:5000'],
        ];
    }

    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}