<?php

use Backend\Controllers\UserController;
use Backend\Routes\Router;

require __DIR__ . '/../bootstrap.php';
require  PROJECT_ROOT . '/backend/helpers/helper.php';
$router = new Router();

$router->post('/register', [UserController::class, 'createUser', CreateUserRequest::class]);
$router->post('/login', [UserController::class, 'login']);
$router->post('/logout', [UserController::class, 'logout']);

$router->dispatch(method(), uri());
