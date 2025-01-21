<?php

use Backend\Database\Database;
use Backend\Models\User;
require 'backend/database/Database.php';
require 'backend/Models/User.php';

$db = Database::connect();
$user = User::create([
    'email' => 'kurec@asdasd.com',
    'username' => 'kurec',
    'password' => '123456',
    'created_at' => date('Y-m-d H:i:s'),
]);