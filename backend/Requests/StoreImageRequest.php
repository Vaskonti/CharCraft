<?php

namespace Backend\Requests;

use Backend\Auth\Auth;

class StoreImageRequest extends Request
{
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'maxSize:5000'],
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