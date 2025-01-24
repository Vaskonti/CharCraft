<?php

namespace Backend\Requests;

class CreateUserRequest extends Request
{
    public function rules(): array
    {
        return [
            'username' => ['required', 'min:3'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:6', 'confirmed'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

}
