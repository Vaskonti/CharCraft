<?php

namespace Backend\Controllers;

use Backend\Models\Post;
use Backend\Requests\CreatePostRequest;
use Backend\Requests\RemovePostRequest;
use Backend\Responses\JsonResponse;

class PostController extends Controller
{
    public function createPost(CreatePostRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $data['likes'] = 0;
        $data['is_archived'] = false;
        $post = Post::create($data);

        return $this->jsonResponse([
            'message' => 'Post created successfully!',
            'id' => $post->id,
        ]);
    }

    public function removePost(RemovePostRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $post = Post::find($data['id']);

        if (!$post) {
            return $this->jsonResponse([
                'message' => 'Post not found.',
            ], 404);
        }

        $success = $post->delete();

        return $this->jsonResponse([
            'message' => $success ? 'Post removed successfully!' : 'Failed to remove post.',
        ]);
    }

    public function getPosts(): JsonResponse
    {
        $posts = Post::random(10);

        return $this->jsonResponse($posts);
    }
}
