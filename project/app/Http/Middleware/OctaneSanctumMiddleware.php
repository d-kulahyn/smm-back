<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\Sanctum;

class OctaneSanctumMiddleware
{
    /**
     * Handle an incoming request for Laravel Octane.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Принудительно очищаем ВСЕ состояние аутентификации для каждого запроса в Octane
        $this->clearAuthenticationState($request);

        $response = $next($request);

        // Очищаем состояние после обработки запроса
        $this->clearAuthenticationState($request);

        return $response;
    }

    /**
     * Полная очистка состояния аутентификации
     */
    private function clearAuthenticationState(Request $request): void
    {
        // Очищаем все guards
        Auth::forgetGuards();

        // Сбрасываем текущий guard
        if (method_exists(Auth::class, 'shouldUse')) {
            Auth::shouldUse(null);
        }

        // Очищаем Sanctum состояние
        if (class_exists(Sanctum::class)) {
            // Очищаем кеш токенов Sanctum
            $request->attributes->remove('sanctum.token');
            $request->attributes->remove('sanctum.user');

            // Принудительно сбрасываем пользователя
            Auth::guard('sanctum')->forgetUser();
        }

        // Очищаем кеш пользователя из всех guards
        foreach (['web', 'api', 'sanctum'] as $guard) {
            try {
                Auth::guard($guard)->forgetUser();
            } catch (\Exception $e) {
                // Игнорируем ошибки несуществующих guards
            }
        }

        // Очищаем атрибуты запроса связанные с аутентификацией
        $request->attributes->remove('auth.password_confirmed_at');
        $request->attributes->remove('auth.user');
    }
}
