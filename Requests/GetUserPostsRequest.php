<?php

namespace Backend\Requests;

use Backend\Auth\Auth;
use Firebase\JWT\JWT;

class GetUserPostsRequest extends Request
{
    public function authorize(): bool
    {
        if ($cookie = $this->getCookie('auth_token')) {
            $user = Auth::validateToken($cookie);
            if ($user && $user->sub) {
                $this->setAuthUser($user);
                return true;
            }
        }
        $this->setMessage("access_denied", "Invalid token!");
        return false;
    }
}