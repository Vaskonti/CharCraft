<?php

namespace Backend\Constants;

class HttpMethods
{
    public const GET = 'GET';
    public const POST = 'POST';
    public const PUT = 'PUT';
    public const DELETE = 'DELETE';
    public const PATCH = 'PATCH';
    public const OPTIONS = 'OPTIONS';
    public const HEAD = 'HEAD';
    public const CONNECT = 'CONNECT';
    public const TRACE = 'TRACE';


    public static function getMethods(): array
    {
        return [
            self::GET,
            self::POST,
            self::PUT,
            self::DELETE,
            self::PATCH,
            self::OPTIONS,
            self::HEAD,
            self::CONNECT,
            self::TRACE
        ];
    }
}