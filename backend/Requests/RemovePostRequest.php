<?php

namespace Backend\Requests;

class RemovePostRequest extends Request
{
    public function rules(): array
    {
        return [
            'id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return !isset($_SESSION['user_id']) || $_SESSION['user_id'];
    }
}