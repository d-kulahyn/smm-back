<?php

use App\Infrastructure\API\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('projects/{project}/chats', [ChatController::class, 'index']);
    Route::post('projects/{project}/chats', [ChatController::class, 'create']);
    Route::get('projects/{project}/chats/{chat}', [ChatController::class, 'show']);
    Route::put('projects/{project}/chats/{chat}', [ChatController::class, 'update']);
    Route::delete('projects/{project}/chats/{chat}', [ChatController::class, 'destroy']);

    Route::get('projects/{project}/chats/{chat}/messages', [ChatController::class, 'getMessages']);
    Route::post('projects/{project}/chats/{chat}/messages', [ChatController::class, 'sendMessage']);
    Route::post('projects/{project}/chats/{chat}/messages/voice', [ChatController::class, 'sendVoiceMessage']);

    Route::post('projects/{project}/chats/{chat}/messages/mark-all-read', [ChatController::class, 'markAllMessagesAsRead']);
    Route::post('projects/{project}/chats/{chat}/messages/read', [ChatController::class, 'markMessageAsRead']);

    Route::get('projects/{project}/chats/{chat}/users', [ChatController::class, 'getChatMembers']);
    Route::post('projects/{project}/chats/{chat}/users', [ChatController::class, 'addUserToChat']);
    Route::delete('projects/{project}/chats/{chat}/users/{userId}', [ChatController::class, 'removeUserFromChat']);
});
