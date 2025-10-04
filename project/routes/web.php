<?php

\Illuminate\Support\Facades\Route::get('health', function () {
    return response()->json(['status' => 'ok']);
});

// Тестовый маршрут для проверки
\Illuminate\Support\Facades\Route::get('test', function () {
    return response()->json(123);
});

// Маршрут на корень сайта
\Illuminate\Support\Facades\Route::get('/', function () {
    return response()->json(123);
});
