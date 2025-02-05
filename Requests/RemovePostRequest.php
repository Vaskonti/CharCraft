<?php

namespace Backend\Requests;

class RemovePostRequest extends Request
{
    public function rules(): array
    {
        return [
            'post_id' => ['required', 'integer', 'exists:posts,id'],
        ];
    }

    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}