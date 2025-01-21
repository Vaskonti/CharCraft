<?php

namespace Backend\Models;

class Comment extends Model
{
    protected static string $table = 'comments';

    private int $id;
    private string $content;
    private int $postId;
    private int $userId;
    private int $likes;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}