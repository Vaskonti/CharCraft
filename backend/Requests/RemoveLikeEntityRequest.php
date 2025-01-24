<?php

namespace Backend\Requests;

class RemoveLikeEntityRequest extends Request
{
    public function rules(): array
    {
        return [
            'id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
}