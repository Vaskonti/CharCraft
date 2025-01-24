<?php

namespace Backend\Models;

class EntityLike extends Model
{
    protected static string $table = 'entity_likes';

    private int $id;
    private int $userId;
    private int $entityId;
    private string $entityType;

    public function __construct($data = null)
    {
        parent::__construct($data);
    }
}