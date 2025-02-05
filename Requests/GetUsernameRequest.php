<?php

namespace Backend\Requests;

use Backend\Auth\Auth;
use Firebase\JWT\JWT;

class GetUsernameRequest extends Request
{
    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}