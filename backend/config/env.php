<?php
require_once "env_loader.php";
function env($key, $default = null)
{
    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    }

    return $default;
}