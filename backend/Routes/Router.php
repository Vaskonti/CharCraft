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
