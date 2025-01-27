<?php

namespace Backend\Controllers;

use Backend\Models\AsciiImage;
use Backend\Requests\StoreImageRequest;
use Backend\Responses\JsonResponse;
use Backend\Storage\Storage;

class ImageController extends Controller
{
    public function store(StoreImageRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return new JsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $data = $request->validated();
        $image = $request->file('image');
        $path = config('filesystems.images_path') . $data['user_id'] . '/';
        $fullPath = Storage::put($path, $image);
        AsciiImage::create([
            'user_id' => $data['user_id'],
            'path' => $path,
        ]);

        return new JsonResponse([
            'message' => 'Image uploaded successfully!',
            'image' => $fullPath,
        ]);
    }
}