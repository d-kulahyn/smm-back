<?php

\Illuminate\Support\Facades\Route::get('health', function () {
    return response()->json(['status' => 'ok']);
});
