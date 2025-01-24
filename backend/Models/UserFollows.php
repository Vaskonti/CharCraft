<?php

namespace Backend\Models;

class UserFollows extends Model
{
    protected static string $table = 'follows';

    private int $id;
    private int $followerId;
    private int $followedId;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}