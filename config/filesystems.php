<?php
require __DIR__ . '/../bootstrap.php';

return [
    'logs_dir' => env('LOGS_DIR',   PROJECT_ROOT . '/logs/'),
    'images_path' => env('IMAGES_PATH',  'images/'),
];
