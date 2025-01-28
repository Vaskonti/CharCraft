<?php

namespace Backend\Controllers;

use Backend\Models\EntityLike;
use Backend\Models\Post;
use Backend\Requests\CreateLikeEntityRequest;
use Backend\Requests\RemoveLikeEntityRequest;
use Backend\Responses\JsonResponse;

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
            'user_id' => $user->sub,
            'entity_id' => $data['entity_id'],
            'entity_type' => $data['entity_type'],
        ]);

        $post = Post::where('id', $data['entity_id'])->first();
        $post->incrementLike();

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
            ->where('user_id', $user->sub)
            ->first();

        if (!$like) {
            return $this->jsonResponse([
                'message' => 'Like not found.',
            ], 404);
        }

        $post = Post::where('id', $data['entity_id'])->first();
        $post->decrementLike();
        $success = $like->delete();

        return $this->jsonResponse([
            'message' => $success ? 'Like removed successfully!' : 'Failed to remove like.',
        ]);
    }
}