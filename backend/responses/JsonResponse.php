<?php

namespace Backend\Responses;

use Backend\Responses\Response;

class JsonResponse extends Response
{
    public function __construct($data = [], int $statusCode = 200, array $headers = [])
    {
        $headers["Content-Type"] = "application/json";
        parent::__construct($data, $statusCode, $headers);
    }

    protected function formatResponse(): string
    {
        return json_encode($this->data, JSON_PRETTY_PRINT);
    }
}
