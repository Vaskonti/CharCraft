<?php

use Backend\Controllers\UserController;
use Backend\Routes\Router;

require_once '../backend/controllers/UserController.php';

$router = new Router();

$router->get('/users', [UserController::class, 'listUsers']);
$router->post('/users', [UserController::class, 'createUser']);

$router->dispatch(method(), uri());

