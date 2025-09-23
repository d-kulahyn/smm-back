<?php

use App\Infrastructure\API\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('projects/{project}/chats', [ChatController::class, 'index']);
    Route::post('projects/{project}/chats', [ChatController::class, 'store']);
    Route::post('projects/{project}/chats/voice', [ChatController::class, 'sendVoice']);
    Route::post('projects/{project}/chats/mark-all-read', [ChatController::class, 'markAllAsRead']);
    Route::get('projects/{project}/chats/unread-count', [ChatController::class, 'unreadCount']);
    Route::post('chats/{chat}/mark-read', [ChatController::class, 'markAsRead']);
});
