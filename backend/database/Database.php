<?php

namespace Backend\Database;
use PDO;
use PDOException;
require __DIR__ . '/../config/config.php';

class Database {
    private static $instance = null;
    private $pdo;

    /**
     * @throws \Exception
     */
    private function __construct() {
        $dsn = "mysql:host=" . config('database.host') . ";dbname=" . config('database.database') . ";charset=utf8mb4";

        try {
            $this->pdo = new PDO($dsn, config('database.user'), config('database.password'), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public static function connect(): PDO
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance->pdo;
    }

    private function __clone() {} // Prevent cloning
    public function __wakeup() {}
}
