<?php

use Backend\Controllers\UserController;
use Backend\Routes\Router;

require_once '../backend/routes/Router.php';
$router = new Router();

$router->post('/register', [UserController::class, 'createUser']);
$router->post('/login', [UserController::class, 'login']);
$router->post('/logout', [UserController::class, 'logout']);

$router->dispatch(method(), uri());

