<?php

namespace Backend\Models;

use Backend\Database\Database;
use Exception;
use PDO;

class Model
{
    protected static string $table;
    private array $query;

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

    public static function where($field, $value): static
    {
        $instance = new static();
        $instance->query[] = [$field, $value];
        return $instance;
    }

    public function first(): ?static
    {
        $db = self::connect();
        $query = "SELECT * FROM " . static::$table;
        $params = [];

        if (!empty($this->query)) {
            $conditions = [];
            foreach ($this->query as [$field, $value]) {
                $conditions[] = "$field = ?";
                $params[] = $value;
            }

            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $query .= " LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new static($data) : null;
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
