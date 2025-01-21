<?php

/**
 * @throws Exception
 */
function log_issue($string): bool
{
    $logsDir = config('filesystems.logs_dir');
    $filename = $logsDir . date('Y-m-d') . '.log';
    if (!file_exists($filename)) {
        touch($filename);
    }
    if (!file_put_contents($filename, '[' . date("d/m/y H:i:s") . ']' . "\t" . $string . PHP_EOL, FILE_APPEND)) {
        return false;
    }
    return true;
}