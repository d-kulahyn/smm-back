<?php

use App\Infrastructure\API\Controllers\ChatController;
use App\Infrastructure\API\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/complete', [ProjectController::class, 'complete']);
});
