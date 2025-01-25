<?php

use Backend\Controllers\Controller;
use Backend\Models\EntityLike;
use Backend\Requests\CreateLikeEntityRequest;
use Backend\Requests\RemoveLikeEntityRequest;
use Backend\Responses\JsonResponse;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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
        $user = $request->getAuthUser();
        EntityLike::create([
            'user_id' => $user->id,
            'entity_id' => $data['entity_id'],
            'entity_type' => $data['entity_type'],
        ]);

        return $this->jsonResponse([
            'message' => 'Like created successfully!',
        ]);
    }

    /**
     * @throws Exception
     */
    public function removeLikeEntity(RemoveLikeEntityRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $user = $request->getAuthUser();
        $like = EntityLike::where('entity_id', $data['entity_id'])
            ->where('entity_type', $data['entity_type'])
            ->where('user_id', $user->id)
            ->first();

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