<?php

namespace Backend\Storage;

class Storage
{
    protected static string $storagePath = '/storage';

    public static function put(string $path, array $file): ?string
    {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return null;
        }

        $relativePath = self::$storagePath . $path . uniqid() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $absolutePath = $_SERVER['DOCUMENT_ROOT'] . $relativePath;
        $directory = dirname($absolutePath);

        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }
        if (move_uploaded_file($file['tmp_name'], $absolutePath)) {
            return $relativePath;
        }

        return null;
    }

    public static function get(string $path): ?string
    {
        return 'http://' . config('app.host') . $path;
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
        return $_SERVER['DOCUMENT_ROOT'] . $path;
    }
}