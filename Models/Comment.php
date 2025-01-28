<?php

namespace Backend\Models;

class Comment extends Model
{
    protected static string $table = 'comments';

    protected int $id;
    protected string $content;
    protected int $post_id;
    protected int $user_id;
    protected int $likes;
    protected string $created_at;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}