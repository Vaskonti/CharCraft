<?php

namespace Backend\Requests;

use Backend\Auth\Auth;

class CreatePostRequest extends Request
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3'],
            'content' => ['required', 'string', 'min:3'],
            'ascii_image_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        if ($cookie = $this->getCookie('auth_token')) {
            $user = Auth::validateToken($cookie);
            if ($user && $user->sub) {
                $this->setAuthUser($user);
                return true;
            }
        }
        return false;
    }
}