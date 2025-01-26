<?php

use Backend\Controllers\PostController;
use Backend\Controllers\ImageController;
use Backend\Controllers\UserController;
use Backend\Misc\Log;
use Backend\Routes\Router;

require __DIR__ . '/../vendor/autoload.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");
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
$router->delete('/like/remove', [LikeEntityController::class, 'removeLikeEntity']);

try {
    $router->resolve(method(), uri());
} catch (ReflectionException $e) {
    Log::error($e);
}
