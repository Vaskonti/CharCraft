<?php

namespace Backend\Requests;

use Backend\Auth\Auth;

class CreateLikeEntityRequest extends Request
{
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer'],
            'entity_type' => ['required', 'string', 'in:post,comment'],
            'entity_id' => ['required', 'integer']
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