<?php

namespace Backend\Models;

class User extends Model
{
    protected static string $table = 'users';

    protected int $id;
    protected string $email;
    protected string $username;
    protected string $password;
    protected string $created_at;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}