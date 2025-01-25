<?php

namespace Backend\Models;

class EntityLike extends Model
{
    protected static string $table = 'entity_likes';

    private int $id;
    private int $user_id;
    private int $entity_id;
    private string $entity_type;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}