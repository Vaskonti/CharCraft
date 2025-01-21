<?php

namespace Backend\Responses;
use Backend\Responses\Response;

class HtmlResponse extends Response
{
    public function __construct(string $html, int $statusCode = 200, array $headers = [])
    {
        $headers["Content-Type"] = "text/html";
        parent::__construct($html, $statusCode, $headers);
    }

    protected function formatResponse(): string
    {
        return "<!DOCTYPE html><html lang='en'><body>{$this->data}</body></html>";
    }
}
