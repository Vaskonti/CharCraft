<?php

namespace Backend\Misc;
class Log
{
    private static string $logsDir;

    protected static function getLogsDir(): string
    {
        if (!isset(self::$logsDir)) {
            self::$logsDir = config('filesystems.logs_dir');
        }
        return self::$logsDir;
    }

    public static function error($string): bool
    {
        $logsDir = self::getLogsDir();
        $filename = $logsDir . date('Y-m-d') . '.log';
        if (!file_exists($filename)) {
            touch($filename);
        }
        if (!file_put_contents($filename, '[' . date("d/m/y H:i:s") . ']' . "\t" . $string . PHP_EOL, FILE_APPEND)) {
            return false;
        }
        return true;
    }
}