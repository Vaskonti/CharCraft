<?php

use Backend\Controllers\CommentController;
use Backend\Controllers\ImageController;
use Backend\Controllers\PostController;
use Backend\Controllers\UserController;
use Backend\Routes\Router;

require __DIR__ . '/../vendor/autoload.php';
$router = new Router();

$router->post('/register', [UserController::class, 'createUser']);
$router->post('/login', [UserController::class, 'login']);
$router->post('/logout', [UserController::class, 'logout']);
$router->post('/post', [PostController::class, 'createPost']);
$router->post('/image', [ImageController::class, 'store']);
$router->get('/post/comments', [CommentController::class, 'getComments']);
$router->post('/post/comments', [CommentController::class, 'createComment']);

try {
    $router->resolve(method(), uri());
} catch (ReflectionException $e) {
    log_issue($e);
}
