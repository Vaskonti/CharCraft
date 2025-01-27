<?php

return [
    'token_lifetime' => env('AUTH_TOKEN_LIFETIME', 24),
    'secret_key' => env('AUTH_SECRET_KEY', 'secret_key123'),
    'algorithm' => env('AUTH_ALGORITHM', 'HS256')
];
