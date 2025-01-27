<?php

namespace Backend\Controllers;

use Backend\Models\Post;
use Backend\Requests\CreatePostRequest;
use Backend\Requests\GetUserPostsRequest;
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

        $user = $request->getAuthUser();
        $post = Post::create(array_merge($request->validated(), ['user_id' => $user->sub]));

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
        $posts = Post::random(2);

        return $this->jsonResponse($posts);
    }

    public function getUserPosts(GetUserPostsRequest $request): JsonResponse
    {
        $user = $request->getAuthUser();
        $posts = Post::where('user_id', $user->sub)->all();

        return $this->jsonResponse(array_map(function ($post) {
            return $post->toArray();
        }, $posts));
    }
}
