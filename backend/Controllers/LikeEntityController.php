<?php

use Backend\Controllers\Controller;
use Backend\Models\EntityLike;


class LikeEntityController extends Controller
{

    public function likeEntity(CreateLikeRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        EntityLike::create([
            'userId' => $data['user_id'],
            'entityId' => $data['entity_id'],
            'entityType' => $data['entity_type'],
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        
        return $this->jsonResponse([
            'message' => 'Like created successfully!',
        ]);
    }
}