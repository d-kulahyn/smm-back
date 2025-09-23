<?php

use App\Infrastructure\API\Controllers\MediaFileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('media-files', MediaFileController::class);
    Route::get('media-files/{mediaFile}/download', [MediaFileController::class, 'download']);
    Route::post('media-files/chunk/init', [MediaFileController::class, 'initChunkedUpload']);
    Route::post('media-files/chunk/upload', [MediaFileController::class, 'uploadChunk']);
});
