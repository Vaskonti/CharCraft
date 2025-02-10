<?php

namespace Backend\Controllers;

use Backend\Models\Post;
use Backend\Requests\CreatePostRequest;
use Backend\Requests\GetUserPostsRequest;
use Backend\Requests\RemovePostRequest;
use Backend\Responses\JsonResponse;
use Backend\Models\User;
use Backend\Models\AsciiImage;
use Backend\Storage\Storage;

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
        $post = Post::find($data['post_id']);

        if (!$post) {
            return $this->jsonResponse([
                'message' => 'Post not found.',
            ], 404);
        }

        $post->is_archived = true;
        $post->save();

        return $this->jsonResponse([
            'message' => 'Post removed successfully!'
        ]);
    }
    
    public function getPosts(): JsonResponse
    {
        $posts = Post::where('is_archived', false)->randomGet(10);
        return $this->jsonResponse(array_map(function ($post) {
            return [
                'title' => $post['title'],
                'content' => $post['content'],
                'id' => $post['id'],
                'image_path' =>  Storage::get(AsciiImage::find($post['ascii_image_id'])->path),
                'author_username' => User::find($post['user_id'])->username,
                'created_at' => $post['created_at'],
                'is_archived' => $post['is_archived'],
                'likes' => $post['likes'],
            ];
        }, $posts));
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
