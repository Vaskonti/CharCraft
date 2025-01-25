<?php

namespace Backend\Models;

class Post extends Model
{
    protected static string $table = 'posts';

    private int $id;
    private string $title;
    private string $description;
    private int $ascii_image_id;
    private int $likes;
    private bool $is_archived;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}