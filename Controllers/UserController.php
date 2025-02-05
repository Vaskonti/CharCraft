<?php

namespace Backend\Controllers;

use Backend\Auth\Auth;
use Backend\Models\User;
use Backend\Requests\CreateUserRequest;
use Backend\Requests\LoginRequest;
use Backend\Requests\GetUsernameRequest;
use Backend\Responses\JsonResponse;
use Exception;

class UserController extends Controller
{
    /**
     * @throws Exception
     */
    public function createUser(CreateUserRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $user = User::create([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'email' => $data['email'],
        ]);
        $token = Auth::generateToken($user->id);
        $this->setCookie(
            name: 'auth_token',
            value: $token,
            expire: time() + 60 * 60 * (int)config('auth.token_lifetime'),
            httponly: true
        );
        setcookie('auth_token', $token, time() + 60 * 60 * (int)config('auth.token_lifetime'), '/', '', true, true);

        return $this->jsonResponse([
            'message' => 'User created successfully!',
        ]);
    }

    /**
     * @throws Exception
     */
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
            $token = Auth::generateToken($user->id);
            $this->setCookie(
                name: 'auth_token',
                value: $token,
                expire: time() + 60 * 60 * (int)config('auth.token_lifetime'),
                httponly: true
            );

            return $this->jsonResponse([
                'message' => 'Successful login!'
            ]);
        }

        return $this->jsonResponse([
            'message' => 'Invalid email password combination'
        ], 401);
    }

    /**
     * @throws Exception
     */
    public function logout(): JsonResponse
    {
        if ($_COOKIE['auth_token'] === null) {
            return $this->jsonResponse([
                'message' => 'You are not logged in!'
            ], 401);
        }
        $this->setCookie(
            name: 'auth_token',
            value: '',
            expire: time() - 3600,
            httponly: true
        );
        return $this->jsonResponse([
            'message' => 'Logged out successfully!'
        ]);
    }
    
    /**
     * @throws Exception
     */
    public function getUsername(GetUsernameRequest $request): JsonResponse
    {
        $authUser = $request->getAuthUser();
        $userId = $authUser->sub;
        $user = User::find($userId);

        if (!$user) {
            return $this->jsonResponse([
                'message' => 'User not found!'
            ], 404);
        }
        
        
        return $this->jsonResponse([
            'username' => $user->username
        ]);
    }
}