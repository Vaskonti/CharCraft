<?php

namespace Backend\Controllers;

use Backend\Responses\HtmlResponse;
use Backend\Responses\JsonResponse;
use Backend\Responses\Response;
use Backend\Responses\XmlResponse;

class Controller
{
    protected function jsonResponse($data, int $statusCode = 200): JsonResponse
    {
        return new JsonResponse($data, $statusCode);
    }

    protected function htmlResponse($html, int $statusCode = 200): HtmlResponse
    {
        return new HtmlResponse($html, $statusCode);
    }

    protected function xmlResponse($data, int $statusCode = 200): XmlResponse
    {
        return new XmlResponse($data, $statusCode);
    }

    /**
     * @throws \Exception
     */
    protected function setCookie($name, $value, $expire = 0, $path = '/', $domain = '', $secure = false, $httponly = false): void
    {
        if ($domain === '')
            $domain = config('app.host');
        setcookie($name, $value, $expire, $path, $domain, $secure, $httponly);
    }
}
