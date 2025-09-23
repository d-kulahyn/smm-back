<?php

use App\Infrastructure\API\Controllers\ProjectInvitationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('projects/{project}')->group(function () {
        Route::get('invitations', [ProjectInvitationController::class, 'index']);
        Route::post('invitations', [ProjectInvitationController::class, 'store']);
    });

    Route::post('invitations/{token}/accept', [ProjectInvitationController::class, 'accept']);
    Route::post('invitations/{token}/decline', [ProjectInvitationController::class, 'decline']);

    Route::get('my-invitations', [ProjectInvitationController::class, 'myInvitations']);
});
