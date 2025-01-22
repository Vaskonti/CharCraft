<?php

namespace Backend\Models;

class AsciiImage extends Model
{
    protected static string $table = 'ascii_images';

    private int $id;
    private int $userId;
    private string $path;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}