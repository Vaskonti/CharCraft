<?php

namespace Backend\Controllers;

use Backend\Models\Comment;
use Backend\Models\User;
use Backend\Requests\CreateCommentRequest;
use Backend\Requests\GetCommentsInPostRequest;
use Backend\Responses\JsonResponse;

class CommentController extends Controller
{
    public function createComment(CreateCommentRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }
        $user = $request->getAuthUser();

        $comment = Comment::create(array_merge(
            $request->validated(),
            ['user_id' => $user->sub]
        ));
        return $this->jsonResponse([
            'message' => 'Comment created successfully!',
            'comment_id' => $comment->id,
        ]);
    }

    public function getComments(GetCommentsInPostRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $comments = Comment::where('post_id', $data['post_id'])->all();
        return $this->jsonResponse(array_map(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'likes' => $comment->likes,
                'created_at' => $comment->created_at,
                'username' => User::find($comment->user_id)->username,
            ];
        }, $comments));
    }
}
