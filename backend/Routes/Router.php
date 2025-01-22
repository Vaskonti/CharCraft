<?php

namespace Backend\Routes;
use ReflectionException;
use ReflectionFunction;
use ReflectionMethod;

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

    /**
     * @throws ReflectionException
     */
    public function resolve($method, $uri): void
    {
        if (!isset($this->routes[$method][$uri])) {
            http_response_code(404);
            echo "404 Not Found";
            return;
        }

        $action = $this->routes[$method][$uri];

        if (is_array($action)) {
            [$controller, $method] = $action;
            $controllerInstance = new $controller();
            $parameters = $this->resolveMethodDependencies($controllerInstance, $method);
            call_user_func_array([$controllerInstance, $method], $parameters);
        } elseif (is_callable($action)) {
            $parameters = $this->resolveFunctionDependencies($action);
            call_user_func_array($action, $parameters);
        }
    }

    /**
     * @throws ReflectionException
     */
    private function resolveMethodDependencies($controller, $method): array
    {
        $reflection = new ReflectionMethod($controller, $method);
        return $this->resolveDependencies($reflection->getParameters());
    }

    /**
     * @throws ReflectionException
     */
    private function resolveFunctionDependencies($function): array
    {
        $reflection = new ReflectionFunction($function);
        return $this->resolveDependencies($reflection->getParameters());
    }

    private function resolveDependencies($parameters): array
    {
        $dependencies = [];
        foreach ($parameters as $parameter) {
            $type = $parameter->getType();
            if ($type && !$type->isBuiltin()) {
                $dependencies[] = new ($type->getName());
            } else {
                $dependencies[] = null;
            }
        }
        return $dependencies;
    }
}
