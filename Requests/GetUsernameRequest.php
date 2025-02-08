<?php

namespace Backend\Requests;


class GetUsernameRequest extends Request
{
    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}