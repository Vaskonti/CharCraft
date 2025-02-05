<?php

namespace Backend\Requests;

use Backend\Auth\Auth;
use Firebase\JWT\JWT;

class GetUserPostsRequest extends Request
{
    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}