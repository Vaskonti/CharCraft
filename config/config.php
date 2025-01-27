<?php

use Backend\Misc\Log;

require_once "env.php";
/**
 * @throws Exception
 */
function config($key):array|string|null
{
    try {
        static $configCache = [];

        list($file, $setting) = explode('.', $key, 2);

        if (!isset($configCache[$file])) {
            $filePath = __DIR__ . "/{$file}.php";

            if (!file_exists($filePath)) {
                throw new Exception("Config file '{$file}.php' not found");
            }

            $configCache[$file] = require $filePath;
        }

        if (!isset($setting)) {
            return $configCache[$file] ?? null;
        }

        if (!isset($configCache[$file][$setting])) {
            throw new Exception("Config setting '{$setting}' not found in '{$file}.php'");
        }

        return $configCache[$file][$setting];
    } catch (Exception $exception) {
        Log::error($exception);
        return null;
    }
}