<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AggressiveGarbageCollection
{
    public function handle(Request $request, Closure $next)
    {
        // Принудительная очистка ПЕРЕД запросом
        $this->forceCleanup();

        $response = $next($request);

        return $response;
    }

    public function terminate($request, $response)
    {
        // Принудительная очистка ПОСЛЕ запроса
        $this->forceCleanup();

        // Дополнительная агрессивная очистка
        $this->aggressiveCleanup();
    }

    private function forceCleanup()
    {
        // Принудительная сборка мусора
        if (function_exists('gc_collect_cycles')) {
            gc_collect_cycles();
        }

        // Очистка всех возможных кэшей
        if (app()->bound('cache')) {
            try {
                app('cache')->flush();
            } catch (\Exception $e) {
                // Игнорируем ошибки
            }
        }

        // Очистка opcache
        if (function_exists('opcache_invalidate') && function_exists('opcache_get_status')) {
            try {
                $status = opcache_get_status();
                if ($status && isset($status['scripts'])) {
                    foreach ($status['scripts'] as $script => $data) {
                        opcache_invalidate($script, true);
                    }
                }
            } catch (\Exception $e) {
                // Игнорируем ошибки
            }
        }
    }

    private function aggressiveCleanup()
    {
        // Очистка всех instances в контейнере
        $criticalInstances = [
            'auth', 'auth.driver', 'auth.manager',
            'session', 'session.store', 'session.manager',
            'request', 'router', 'url',
            'sanctum', 'sanctum.guard', 'sanctum.token', 'sanctum.user',
            'cookie', 'encrypter', 'hash',
            'validator', 'validation.presence',
            'view', 'view.engine.resolver', 'blade.compiler',
            'db', 'db.connection', 'db.manager',
            'cache', 'cache.store', 'cache.manager',
            'files', 'filesystem', 'filesystem.disk',
            'translator', 'translation.loader',
        ];

        foreach ($criticalInstances as $instance) {
            try {
                app()->forgetInstance($instance);
            } catch (\Exception $e) {
                // Игнорируем ошибки
            }
        }

        // Очистка всех guard instances
        foreach (config('auth.guards', []) as $guard => $config) {
            try {
                app()->forgetInstance("auth.guard.{$guard}");
            } catch (\Exception $e) {
                // Игнорируем ошибки
            }
        }

        // Очистка всех provider instances
        foreach (config('auth.providers', []) as $provider => $config) {
            try {
                app()->forgetInstance("auth.provider.{$provider}");
            } catch (\Exception $e) {
                // Игнорируем ошибки
            }
        }

        // Принудительный вызов сборщика мусора несколько раз
        if (function_exists('gc_collect_cycles')) {
            for ($i = 0; $i < 3; $i++) {
                gc_collect_cycles();
            }
        }

        // Если память больше 100MB - убиваем воркер
        if (function_exists('memory_get_usage')) {
            $memory = memory_get_usage(true);
            if ($memory > 100 * 1024 * 1024) {
                if (function_exists('posix_kill') && function_exists('posix_getpid')) {
                    posix_kill(posix_getpid(), SIGTERM);
                }
            }
        }
    }
}
