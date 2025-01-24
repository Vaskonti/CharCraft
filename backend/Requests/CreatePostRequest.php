<?php

namespace Backend\Requests;

class CreatePostRequest extends Request
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3'],
            'content' => ['required', 'string', 'min:3'],
            'user_id' => ['required', 'integer'],
            'ascii_image_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return !isset($_SESSION['user_id']) || $_SESSION['user_id'];
    }
}