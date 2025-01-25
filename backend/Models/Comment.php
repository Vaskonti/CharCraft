<?php

namespace Backend\Models;

class Comment extends Model
{
    protected static string $table = 'comments';

    private int $id;
    private string $content;
    private int $post_id;
    private int $user_id;
    private int $likes;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}