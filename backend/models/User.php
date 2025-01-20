<?php

use Backend\Models\Model;

class User extends Model
{
    protected static string $table = 'users';

    private int $id;
    private string $email;
    private string $username;
    private string $password;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}