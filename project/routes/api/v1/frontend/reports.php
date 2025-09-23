<?php

use App\Infrastructure\API\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('reports', [ReportController::class, 'index']);
    Route::get('reports/{id}', [ReportController::class, 'show']);
    Route::post('reports/generate', [ReportController::class, 'generateAutomatic']);
    Route::get('reports/dashboard', [ReportController::class, 'dashboard']);

    Route::get('metrics', [ReportController::class, 'metrics']);
    Route::post('metrics/manual', [ReportController::class, 'addManualMetric']);
    Route::get('metrics/predefined', [ReportController::class, 'predefinedMetrics']);
});
