<?php

namespace Backend\Requests;

use Backend\Auth\Auth;

class CreateLikeEntityRequest extends Request
{
    public function rules(): array
    {
        return [
            'entity_type' => ['required', 'string', 'in:post,comment'],
            'entity_id' => ['required', 'integer']
        ];
    }

    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}