<?php

namespace Backend\Requests;
use Backend\Requests\Request;
class LoginRequest extends Request
{

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'min:6']
        ];
    }
}