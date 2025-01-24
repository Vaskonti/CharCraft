<?php

namespace Backend\Routes;
use Backend\Constants\HttpMethods;
use ReflectionException;
use ReflectionFunction;
use ReflectionMethod;

class Router
{
    private array $routes = [];

    public function get(string $path, callable|array $callback): void
    {
        $this->routes[$path][HttpMethods::GET] = $callback;
    }

    public function post(string $path, callable|array $callback): void
    {
        $this->routes[$path][HttpMethods::POST] = $callback;
    }

    public function patch(string $path, callable|array $callback): void
    {
        $this->routes[$path][HttpMethods::PATCH] = $callback;
    }

    public function put(string $path, callable|array $callback): void
    {
        $this->routes[$path][HttpMethods::PUT] = $callback;
    }

    public function delete(string $path, callable|array $callback): void
    {
        $this->routes[$path][HttpMethods::DELETE] = $callback;
    }

    /**
     * @throws ReflectionException
     */
    public function resolve($method, $uri): void
    {
        if (!isset($this->routes[$uri])) {
            http_response_code(404);
            echo "404 Not Found";
            return;
        }
        if (!isset($this->routes[$uri][$method])) {
            http_response_code(405);
            header("Allow: " . implode(", ", array_keys($this->routes[$uri])));
            echo "405 Method Not Allowed";
            return;
        }

        $action = $this->routes[$uri][$method];

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
