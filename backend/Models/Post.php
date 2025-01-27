<?php

namespace Backend\Models;

class Post extends Model
{
    protected static string $table = 'posts';

    protected int $id;
    protected string $title;
    protected string $content;
    protected int $ascii_image_id;
    protected int $likes;
    protected int $user_id;
    protected string $created_at;
    protected bool $is_archived;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}