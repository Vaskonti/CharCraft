<?php

use Backend\Models\Model;

class User extends Model
{
    protected static $table = 'users';

    private int $id;
    private string $email;
    private string $username;
    private string $password;

    public function __construct($data = null)
    {
        parent::__construct($data);
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
        return null; // Return null if no results are found
    }
}