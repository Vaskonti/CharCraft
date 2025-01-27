<?php

use Backend\Database\Database;

require __DIR__ . '/../../vendor/autoload.php';

$database = Database::connect();

$database->query("CREATE TABLE migrations_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL,
            batch INT NOT NULL
)");

