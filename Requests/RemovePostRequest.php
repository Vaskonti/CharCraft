<?php

namespace Backend\Requests;

use Backend\Auth\Auth;

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