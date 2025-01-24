<?php

namespace Backend\Controllers;

use Backend\Models\Comment;
use Backend\Requests\CreateCommentRequest;
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

        $data = $request->validated();
        $comment = Comment::create([
            'content' => $data['content'],
            'post_id' => $data['post_id'],
            'user_id' => $data['user_id'],
            'likes' => 0,
        ]);

        return $this->jsonResponse([
            'message' => 'Comment created successfully!',
            'comment_id' => $comment->id,
        ]);
    }

    public function getCommentsInPostRequest(GetCommentsInPostRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return $this->jsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $comments = Comment::where('post_id', $data['post_id'])->all();

        return $this->jsonResponse($comments);
    }
}
