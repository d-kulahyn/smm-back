<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Context;
use Illuminate\Contracts\Auth\StatefulGuard;

class ClearOctaneState
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Принудительно очищаем состояние Auth перед каждым запросом
        $this->clearAuthState();

        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Response  $response
     * @return void
     */
    public function terminate($request, $response)
    {
        // Дополнительная очистка после отправки ответа
        $this->clearAuthState();

        // Принудительная сборка мусора
        if (function_exists('gc_collect_cycles')) {
            gc_collect_cycles();
        }
    }

    /**
     * Безопасно очищает состояние аутентификации
     */
    private function clearAuthState()
    {
        try {
            // Очищаем основной guard
            if (Auth::check()) {
                if (Auth::guard() instanceof StatefulGuard) {
                    Auth::logout();
                }
                Auth::forgetUser();
            }

            // Очищаем все настроенные Guards безопасно
            foreach (config('auth.guards', []) as $guardName => $config) {
                try {
                    $guard = Auth::guard($guardName);

                    // Проверяем, является ли guard StatefulGuard (имеет logout метод)
                    if ($guard instanceof StatefulGuard && method_exists($guard, 'logout')) {
                        $guard->logout();
                    }

                    // Очищаем пользователя, если метод существует
                    if (method_exists($guard, 'forgetUser')) {
                        $guard->forgetUser();
                    }

                    // Для RequestGuard (Sanctum) используем setUser(null) - только для RequestGuard!
                    if (get_class($guard) === 'Illuminate\Auth\RequestGuard' && method_exists($guard, 'setUser')) {
                        $guard->setUser(null);
                    }

                    // Для SessionGuard НЕ используем setUser(null) - только logout() и forgetUser()
                    // SessionGuard требует Authenticatable объект в setUser(), поэтому просто не вызываем его

                } catch (\Exception $e) {
                    // Игнорируем ошибки при очистке отдельных guards
                    continue;
                }
            }

            // Очищаем контекст Laravel (если используется)
            if (class_exists(Context::class)) {
                Context::flush();
            }
        } catch (\Exception $e) {
            // Игнорируем все ошибки очистки - они не должны ломать запросы
        }
    }
}
