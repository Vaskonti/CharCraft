<?php

// Boilerplate

require_once '../backend/controllers/UserController.php';
require_once '../backend/controllers/ProductController.php';

$routes = [
    'GET' => [
        '/api/users' => [UserController::class, 'getAll'],
        '/api/products' => [ProductController::class, 'getAll'],
    ],
    'POST' => [
        '/api/users' => [UserController::class, 'create'],
        '/api/products' => [ProductController::class, 'create'],
    ],
];

// Вземане на текущия път и метод
$requestUri = strtok($_SERVER['REQUEST_URI'], '?'); // Премахва query string
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Проверка за съвпадение в масива от маршрути
$handler = $routes[$requestMethod][$requestUri] ?? null;

if ($handler) {
    [$controllerClass, $method] = $handler;

    // Уверяваме се, че класът и методът съществуват
    if (class_exists($controllerClass) && method_exists($controllerClass, $method)) {
        $controller = new $controllerClass();
        echo json_encode($controller->$method());
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Internal Server Error']);
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
