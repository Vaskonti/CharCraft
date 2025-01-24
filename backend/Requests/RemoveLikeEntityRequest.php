<?php

namespace Backend\Requests;

class RemoveLikeEntityRequest extends Request
{
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer'],
            'entity_type' => ['required', 'string', 'in:post,comment'],
            'entity_id' => ['required', 'integer']
        ];
    }

    public function authorize(): bool
    {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
}