<?php

namespace Backend\Requests;

class GetUserImagesRequest extends Request
{
    public function rules(): array
    {
        return [];
    }

    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}