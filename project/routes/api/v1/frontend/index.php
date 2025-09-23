<?php

use App\Infrastructure\API\Controllers\ActivityController;
use Illuminate\Support\Facades\Route;

require base_path('routes/api/v1/frontend/auth.php');
require base_path('routes/api/v1/frontend/profile.php');
require base_path('routes/api/v1/frontend/projects.php');
require base_path('routes/api/v1/frontend/project-invitations.php');
require base_path('routes/api/v1/frontend/chats.php');
require base_path('routes/api/v1/frontend/tasks.php');
require base_path('routes/api/v1/frontend/media-files.php');
require base_path('routes/api/v1/frontend/social-accounts.php');
require base_path('routes/api/v1/frontend/reports.php');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('activities', [ActivityController::class, 'index']);
    Route::post('activities/status/batch', [ActivityController::class, 'statusBatch']);
});

require base_path('routes/api/v1/common.php');
