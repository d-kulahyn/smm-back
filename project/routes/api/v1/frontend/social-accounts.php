<?php

use App\Infrastructure\API\Controllers\SocialMediaAccountController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('social-accounts', SocialMediaAccountController::class);
    Route::post('social-accounts/{id}/refresh-token', [SocialMediaAccountController::class, 'refreshToken']);
    Route::post('social-accounts/{id}/disconnect', [SocialMediaAccountController::class, 'disconnect']);
    Route::get('social-accounts/connected-platforms', [SocialMediaAccountController::class, 'connectedPlatforms']);
    Route::post('oauth/{platform}/callback', [SocialMediaAccountController::class, 'oauthCallback']);
});
