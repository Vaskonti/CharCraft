<?php

namespace Backend\Models;

class AsciiImage extends Model
{
    protected static string $table = 'ascii_images';

    protected int $id;
    protected int $user_id;
    protected string $path;
    protected string $created_at;
    protected string $updated_at;
    protected bool $is_archived;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}