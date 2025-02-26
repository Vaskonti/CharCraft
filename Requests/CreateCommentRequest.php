<?php

namespace Backend\Requests;

class CreateCommentRequest extends Request
{
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:255'],
            'post_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}