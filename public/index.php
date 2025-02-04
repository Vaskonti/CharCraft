<?php

use Backend\Controllers\CommentController;
use Backend\Controllers\ImageController;
use Backend\Controllers\LikeEntityController;
use Backend\Controllers\PostController;
use Backend\Controllers\UserController;
use Backend\Misc\Log;
use Backend\Routes\Router;

require __DIR__ . '/../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Send preflight response
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
}

$router = new Router();

$router->post('/register', [UserController::class, 'createUser']);
$router->post('/login', [UserController::class, 'login']);
$router->post('/logout', [UserController::class, 'logout']);
$router->post('/post', [PostController::class, 'createPost']);
$router->get('/posts', [PostController::class, 'getPosts']);
$router->get('/user/posts', [PostController::class, 'getUserPosts']);
$router->post('/image', [ImageController::class, 'store']);
$router->delete('/post/remove', [PostController::class, 'removePost']);
$router->post('/like', [LikeEntityController::class, 'likeEntity']);
$router->delete('/unlike', [LikeEntityController::class, 'removeLikeEntity']);
$router->get('/post/comments', [CommentController::class, 'getComments']);
$router->post('/post/comment', [CommentController::class, 'createComment']);

try {
    $router->resolve($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
} catch (\Exception $e) {
    Log::error($e);
}
