<?php

namespace Backend\Requests;

class CreateUserRequest extends Request
{
    public function rules(): array
    {
        return [
            'username' => 'required|min:3',
            'email' => 'required|email',
            'password' => 'required|min:6',
            'password_confirmation' => 'required|min:6'
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'username' => [
                'required' => 'Username is required.',
                'min' => 'Username must be at least 3 characters long.'
            ],
            'email' => [
                'required' => 'Email is required.',
                'email' => 'Please enter a valid email address.'
            ],
            'password' => [
                'required' => 'Password is required.',
                'min' => 'Password must be at least 6 characters long.'
            ],
            'password_confirmation' => [
                'required' => 'Please repeat the password',
            ]
        ];
    }
}
