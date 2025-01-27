<?php

use Backend\Misc\Log;

require_once __DIR__ . '/../misc/Log.php';
/**
 * @throws Exception
 */
function load_env($filePath): void
{
    if (!file_exists($filePath)) {
        throw new Exception("File does not exist: " . $filePath);
    }
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);

        $key = trim($key);
        $value = trim($value);
        $value = trim($value, '"\'');

        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

/**
 * @throws Exception
 */
try {
    load_env(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '.env');
} catch (\Exception $e) {
    Log::error($e);
}
