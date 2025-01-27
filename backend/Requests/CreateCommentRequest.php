<?php

namespace Backend\Requests;

use Backend\Auth\Auth;

class CreateCommentRequest extends Request
{
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:255'],
            'post_id' => ['required', 'integer'],
            'user_id' => ['required', 'exists:users,id'],
        ];
    }

    public function authorize(): bool
    {
        if ($cookie = $this->getCookie('auth_token')) {
            $user = Auth::validateToken($cookie);
            return $user && $user->sub;
        }
        return false;
    }
}