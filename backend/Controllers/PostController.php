<?php

namespace Backend\Controllers;

use Backend\Models\Post;
use Backend\Requests\CreatePostRequest;
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

         $id = Post::create($request->validated());

         return $this->jsonResponse([
             'message' => 'Post created successfully!',
             'id' => $id
         ]);
    }

    public function getPosts(): JsonResponse
    {

    }
}