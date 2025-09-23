<?php

use App\Infrastructure\API\Controllers\ProjectMemberController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('projects/{project}')->group(function () {
        Route::get('members', [ProjectMemberController::class, 'index']);
        Route::post('members', [ProjectMemberController::class, 'store']);
        Route::put('members/{userId}', [ProjectMemberController::class, 'update']);
        Route::delete('members/{userId}', [ProjectMemberController::class, 'destroy']);
    });
});
