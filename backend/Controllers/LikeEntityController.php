<?php

use Backend\Controllers\Controller;
use Backend\Models\EntityLike;

class LikeEntityController extends Controller
{

    public function likeEntity(CreateLikeEntityRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        EntityLike::create([
            'user_id' => $data['user_id'],
            'entity_id' => $data['entity_id'],
            'entity_type' => $data['entity_type'],
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        
        return $this->jsonResponse([
            'message' => 'Like created successfully!',
        ]);
    }

    public function removeLikeEntity(RemoveLikeEntityRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $like = EntityLike::find($data['id']);

        if (!$like) {
            return $this->jsonResponse([
                'message' => 'Like not found.',
            ], 404);
        }

        $success = $like->delete();

        return $this->jsonResponse([
            'message' => $success ? 'Like removed successfully!' : 'Failed to remove like.',
        ]);
    }
}