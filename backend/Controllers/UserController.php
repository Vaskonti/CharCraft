<?php

namespace Backend\Controllers;

use Backend\Models\User;
use Backend\Requests\CreateUserRequest;
use Backend\Requests\LoginRequest;
use Backend\Responses\JsonResponse;

class UserController extends Controller
{
    public function createUser(CreateUserRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        User::create([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'email' => $data['email'],
        ]);

        return $this->jsonResponse([
            'message' => 'User created successfully!',
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $user = User::where('email', $data['email'])->first();

        if (password_verify($data['password'], $user->password)) {
            session_start();
            $_SESSION['user_id'] = $user->id;
            $_SESSION['logged_id'] = true;

            return $this->jsonResponse([
                'message' => 'Successful login!'
            ]);
        }

        return $this->jsonResponse([
            'message' => 'Invalid email password combination'
        ], 401);
    }

    public function logout(): JsonResponse
    {
        session_destroy();
        return $this->jsonResponse([
            'message' => 'Logged out successfully!'
        ]);
    }
}