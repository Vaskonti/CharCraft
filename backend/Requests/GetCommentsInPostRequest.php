<?php

namespace Backend\Requests;

class GetCommentsInPostRequest extends Request
{
    public function rules(): array
    {
        return [
            'post_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}