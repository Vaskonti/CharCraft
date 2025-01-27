<?php

namespace Backend\Controllers;

use Backend\Models\Comment;
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

        $comment = Comment::create($request->validated());
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
        //TODO: Implement pagination
        return $this->jsonResponse($comments);
    }
}
