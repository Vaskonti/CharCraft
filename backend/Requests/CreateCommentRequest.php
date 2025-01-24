<?php

namespace Backend\Requests;

class CreateCommentRequest extends Request
{
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:255'],
            'post_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return isset($_SESSION['user_id']) && $_SESSION['user_id'];
    }
}