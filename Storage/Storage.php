<?php

namespace Backend\Storage;

class Storage
{
    protected static string $storagePath = PROJECT_ROOT . '/backend/storage/';

    public static function put(string $path, array $file): ?string
    {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return null;
        }

        $fullPath = self::$storagePath . $path . uniqid() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $directory = dirname($fullPath);

        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }
        if (move_uploaded_file($file['tmp_name'], $fullPath)) {
            return $fullPath;
        }

        return null;
    }

    public static function get(string $path): ?string
    {
        $fullPath = self::$storagePath . $path;
        return file_exists($fullPath) ? file_get_contents($fullPath) : null;
    }

    public static function exists(string $path): bool
    {
        return file_exists(self::$storagePath . $path);
    }

    public static function delete(string $path): bool
    {
        return static::exists($path) && unlink(static::path($path));
    }

    public static function path(string $path): string
    {
        return self::$storagePath . $path;
    }
}