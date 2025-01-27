<?php

namespace Backend\Models;

class UserFollows extends Model
{
    protected static string $table = 'follows';

    protected int $id;
    protected int $follower_id;
    protected int $followed_id;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}