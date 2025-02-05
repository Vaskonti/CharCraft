<?php
namespace Backend\Requests\Traits;

use Backend\Auth\Auth;

trait HasProtectedRoute
{
    protected array $messages = [];
    protected $authUser;
    protected function authorizeAccess(): bool
    {
        if ($cookie = $this->getCookie('auth_token')) {
            $user = Auth::validateToken($cookie);
            if ($user && $user->sub) {
                $this->setAuthUser($user);
                return true;
            }
        }
        $this->setMessage('access_denied', 'Invalid access token. Please login.');
        return false;
    }
    protected function setMessage(string $key, string $message): void
    {
        $this->messages[$key] = $message;
    }

    protected function getMessage(string $key): ?string
    {
        return $this->messages[$key];
    }

    private function hasCookie(string $name): bool
    {
        return isset($_COOKIE[$name]);
    }

    public function getCookie(string $name): ?string
    {
        return $_COOKIE[$name] ?? null;
    }

    public function getAuthUser()
    {
        return $this->authUser;
    }

    public function setAuthUser($user): void
    {
        $this->authUser = $user;
    }
}