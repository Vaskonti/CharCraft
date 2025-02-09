<?php

namespace Backend\Requests;

class GetImagePathRequest extends Request
{
    public function rules(): array
    {
        return [
            'image_id' => ['required', 'integer', 'exists:ascii_images,id'],
        ];
    }

    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}