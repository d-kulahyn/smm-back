<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class SwooleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): BaseResponse
    {
        // Установка заголовков для Swoole
        $response = $next($request);

        // Добавляем заголовки производительности
        if ($response instanceof Response) {
            $response->headers->set('X-Powered-By', 'Swoole/' . swoole_version() . ' Laravel/Octane');
            $response->headers->set('X-Server-Type', 'Swoole');

            // Оптимизация для статических файлов
            if ($this->isStaticFile($request)) {
                $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
                $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
            }

            // Установка заголовков безопасности
            $response->headers->set('X-Content-Type-Options', 'nosniff');
            $response->headers->set('X-Frame-Options', 'DENY');
            $response->headers->set('X-XSS-Protection', '1; mode=block');

            // Оптимизация соединения
            if ($request->server('HTTP_CONNECTION') !== 'close') {
                $response->headers->set('Connection', 'keep-alive');
                $response->headers->set('Keep-Alive', 'timeout=60, max=1000');
            }
        }

        return $response;
    }

    /**
     * Проверяем, является ли запрос статическим файлом
     */
    private function isStaticFile(Request $request): bool
    {
        $path = $request->getPathInfo();
        $staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

        foreach ($staticExtensions as $extension) {
            if (str_ends_with($path, $extension)) {
                return true;
            }
        }

        return false;
    }
}
