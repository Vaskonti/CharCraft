<?php

namespace Backend\Responses;


class Response
{
    protected int $statusCode;
    protected array $headers = [];
    protected mixed $data;

    public function __construct($data = "", int $statusCode = 200, array $headers = [])
    {
        $this->data = $data;
        $this->statusCode = $statusCode;
        $this->headers = $headers;
        $this->send();
    }

    protected function setHeaders(): void
    {
        http_response_code($this->statusCode);
        foreach ($this->headers as $key => $value) {
            header("$key: $value");
        }
    }


    public function send(): void
    {
        $this->setHeaders();
        echo $this->formatResponse();
    }

    protected function formatResponse(): string
    {
        return (string)$this->data;
    }
}
