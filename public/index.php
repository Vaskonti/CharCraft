<?php

use Backend\Controllers\CommentController;
use Backend\Controllers\ImageController;
use Backend\Controllers\PostController;
use Backend\Controllers\UserController;
use Backend\Routes\Router;

require __DIR__ . '/../vendor/autoload.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Send preflight response
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200); // Send HTTP 200 OK
    exit;
}
// Your existing POST handling logic
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json"); // Ensure response type is JSON
}

$router = new Router();

$router->post('/register', [UserController::class, 'createUser']);
$router->post('/login', [UserController::class, 'login']);
$router->post('/logout', [UserController::class, 'logout']);
$router->post('/post', [PostController::class, 'createPost']);
$router->post('/image', [ImageController::class, 'store']);
$router->get('/post/comments', [CommentController::class, 'getComments']);
$router->post('/post/comments', [CommentController::class, 'createComment']);
$router->get('/post', [PostController::class, 'getPosts']);

try {
    $router->resolve(method(), uri());
} catch (ReflectionException $e) {
    log_issue($e);
}
