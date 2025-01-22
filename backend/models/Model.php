<?php

namespace Backend\Models;

use Backend\Database\Database;
use Exception;
use PDO;

class Model
{
    protected static string $table;

    protected static function connect(): PDO
    {
        return Database::connect();
    }

    public function __construct($data = null)
    {
        if ($data) {
            foreach ($data as $key => $value) {
                $this->$key = $value;
            }
        }
    }

    public static function create(array $data): ?Model
    {
        $db = self::connect();
        $fields = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $values = array_values($data);
        $stmt = $db->prepare("INSERT INTO " . static::$table . " ($fields) VALUES ($placeholders)");
        $stmt->execute($values);
        $id = $db->lastInsertId();
        return static::find($id);
    }

    private static function getConnection()
    {
        static $db;
        if (!$db) {
            $db = Database::connect();
        }
        return $db;
    }

    public static function find($id): ?static
    {
        $db = self::connect();
        $stmt = $db->prepare("SELECT * FROM " . static::$table . " WHERE id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            return new static($data);
        }
        return null;
    }

    public static function where($field, $value): ?Model
    {
        $db = self::connect();
        $stmt = $db->prepare("SELECT * FROM " . static::$table . " WHERE $field = ?");
        $stmt->execute([$value]);
        $results = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $results[] = new static($data);
        }

        // Return the results, allowing method chaining
        return new static($results) ?? null;
    }

    public static function first(): null|static
    {
        $db = self::connect();
        $stmt = $db->prepare("SELECT * FROM " . static::$table . " LIMIT 1");
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            return new static($data);
        }
        return null;
    }

    /**
     * @throws Exception
     */
    public function __get($property)
    {
        if (property_exists($this, $property)) {
            return $this->$property;
        }
        throw new Exception("Property '$property' not found.");
    }

    /**
     * @throws Exception
     */
    public function __set($property, $value)
    {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        } else {
            throw new Exception("Property '$property' not found.");
        }
    }
}
