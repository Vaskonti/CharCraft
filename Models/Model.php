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

    /**
     * @throws Exception
     */
    public function delete(): bool
    {
        $db = self::connect();

        if (!property_exists($this, 'id') || empty($this->id)) {
            throw new Exception("Cannot delete record: 'id' property is missing or not set.");
        }

        $stmt = $db->prepare("DELETE FROM " . static::$table . " WHERE id = ?");
        return $stmt->execute([$this->id]);
    }

    public static function random(int $limit): array
    {
        $db = self::connect();
        $stmt = $db->prepare("SELECT * FROM " . static::$table . " ORDER BY RAND() LIMIT ?");
        $stmt->bindValue(1, $limit, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
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

    public function all(): ?array
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
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($item) => new static($item), $data);
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }

    public function save(): void
    {
        $db = self::connect();
        $fields = [];
        $values = [];
        foreach ($this as $key => $value) {
            $fields[] = "$key = ?";
            $values[] = $value;
        }
        $values[] = $this->id;
        $stmt = $db->prepare("UPDATE " . static::$table . " SET " . implode(', ', $fields) . " WHERE id = ?");
        $stmt->execute($values);
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
