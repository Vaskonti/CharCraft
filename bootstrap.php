<?php
define('PROJECT_ROOT', realpath(__DIR__ ));

function autoload($className): void
{
    $baseDir = PROJECT_ROOT . DIRECTORY_SEPARATOR;

    $className = str_replace('\\', DIRECTORY_SEPARATOR, $className);
    $className = strtolower($className);

    $file = $baseDir . $className . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
}

spl_autoload_register('autoload');
