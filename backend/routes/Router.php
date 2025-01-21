<?php

namespace Backend\Routes;
class Router
{
    private array $routes = [];

    public function get(string $path, callable|array $callback): void
    {
        $this->routes['GET'][$path] = $callback;
    }

    public function post(string $path, callable|array $callback): void
    {
        $this->routes['POST'][$path] = $callback;
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH);

        if (isset($this->routes[$method][$path])) {
            $callback = $this->routes[$method][$path];

            if (is_array($callback)) {
                $controller = new $callback[0]();
                $method = $callback[1];
                echo $controller->$method();
            } else {
                echo call_user_func($callback);
            }
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Route not found"]);
        }
    }
}
