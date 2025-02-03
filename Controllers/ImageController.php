<?php

namespace Backend\Controllers;

use Backend\Models\AsciiImage;
use Backend\Requests\StoreImageRequest;
use Backend\Responses\JsonResponse;
use Backend\Storage\Storage;

class ImageController extends Controller
{
    /**
     * @throws \Exception
     */
    public function store(StoreImageRequest $request): JsonResponse
    {
        if (!$request->validate()) {
            return new JsonResponse([
                'errors' => $request->errors(),
            ], 409);
        }

        $user = $request->getAuthUser();
        $image = $request->file('image');
        $path = config('filesystems.images_path') . $user->sub . '/';
        $fullPath = Storage::put($path, $image);
        AsciiImage::create([
            'user_id' => $user->sub,
            'path' => $path,
        ]);

        return new JsonResponse([
            'message' => 'Image uploaded successfully!',
            'image' => $fullPath,
        ]);
    }
}