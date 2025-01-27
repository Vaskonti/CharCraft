<?php

namespace Backend\Auth;

use Backend\Misc\Log;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    public static function generateToken(int $userId): ?string
    {
        try {
            $payload = [
                'iss' => config('app.host'),
                'sub' => $userId,
                'iat' => time(),
                'exp' => time() + (60 * 60 * (int) config('auth.token_lifetime'))
            ];

            return JWT::encode($payload, config('auth.secret_key'), config('auth.algorithm'));
        } catch (\Exception $e) {
            Log::error($e);
            return null;
        }
    }

    public static function validateToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key(config('auth.secret_key'), config('auth.algorithm')));
        } catch (\Exception $e) {
            Log::error($e);
            return null;
        }
    }
}