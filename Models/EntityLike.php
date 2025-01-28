<?php

namespace Backend\Models;

class EntityLike extends Model
{
    protected static string $table = 'entity_likes';

    protected int $id;
    protected int $user_id;
    protected int $entity_id;
    protected string $entity_type;
    protected string $created_at;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}