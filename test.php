<?php

use Backend\Database\Database;
use Backend\Models\User;
require 'backend/database/Database.php';
require 'backend/Models/User.php';

$db = Database::connect();
$user = User::first();
var_dump($user);
