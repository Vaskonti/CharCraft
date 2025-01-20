<?php

return [
    'host' => env("DB_HOST", "localhost"),
    'database' => env("DB_NAME", "default"),
    'user' => env("DB_USER", "root"),
    'password' => env("DB_PASS", "passwd"),
    'port' => env("DB_PORT", 3306),
];