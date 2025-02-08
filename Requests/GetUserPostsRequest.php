<?php

namespace Backend\Requests;

class GetUserPostsRequest extends Request
{
    public function authorize(): bool
    {
        return $this->authorizeAccess();
    }
}