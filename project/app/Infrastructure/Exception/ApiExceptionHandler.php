<?php

declare(strict_types=1);

namespace App\Infrastructure\Exception;

use App\Domain\Exception\DomainException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class ApiExceptionHandler
{
    public function handle(Throwable $exception, Request $request): JsonResponse
    {
        if ($exception instanceof DomainException) {
            return $this->handleDomainException($exception);
        }

        if ($exception instanceof ValidationException) {
            return $this->handleValidationException($exception);
        }

        if ($exception instanceof AuthenticationException) {
            return $this->handleAuthenticationException($exception);
        }

        if ($exception instanceof AuthorizationException) {
            return $this->handleAuthorizationException($exception);
        }

        if ($exception instanceof ModelNotFoundException) {
            return $this->handleModelNotFoundException($exception);
        }

        if ($exception instanceof NotFoundHttpException) {
            return $this->handleNotFoundHttpException($exception);
        }

        if ($exception instanceof HttpException) {
            return $this->handleHttpException($exception);
        }

        return $this->handleGenericException($exception);
    }

    private function handleDomainException(DomainException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $exception->getErrorCode(),
                'message' => $exception->getMessage(),
                'details' => $exception->getErrorDetails()
            ]
        ], $exception->getHttpStatusCode());
    }

    private function handleValidationException(ValidationException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'VALIDATION_FAILED',
                'message' => 'Ошибка валидации данных',
                'details' => [
                    'validation_errors' => $exception->errors()
                ]
            ]
        ], 422);
    }

    private function handleAuthenticationException(AuthenticationException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'UNAUTHENTICATED',
                'message' => 'Пользователь не аутентифицирован',
                'details' => []
            ]
        ], 401);
    }

    private function handleAuthorizationException(AuthorizationException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'UNAUTHORIZED',
                'message' => 'Недостаточно прав для выполнения операции',
                'details' => []
            ]
        ], 403);
    }

    private function handleModelNotFoundException(ModelNotFoundException $exception): JsonResponse
    {
        $model = class_basename($exception->getModel());

        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'RESOURCE_NOT_FOUND',
                'message' => "Ресурс {$model} не найден",
                'details' => []
            ]
        ], 404);
    }

    private function handleNotFoundHttpException(NotFoundHttpException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'ROUTE_NOT_FOUND',
                'message' => 'Маршрут не найден',
                'details' => []
            ]
        ], 404);
    }

    private function handleHttpException(HttpException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'HTTP_ERROR',
                'message' => $exception->getMessage() ?: 'HTTP ошибка',
                'details' => []
            ]
        ], $exception->getStatusCode());
    }

    private function handleGenericException(Throwable $exception): JsonResponse
    {
        // В продакшне не показываем детали ошибки
        if (app()->environment('production')) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'INTERNAL_SERVER_ERROR',
                    'message' => 'Внутренняя ошибка сервера',
                    'details' => []
                ]
            ], 500);
        }

        // В режиме разработки показываем детали
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'INTERNAL_SERVER_ERROR',
                'message' => $exception->getMessage(),
                'details' => [
                    'file' => $exception->getFile(),
                    'line' => $exception->getLine(),
                    'trace' => $exception->getTraceAsString()
                ]
            ]
        ], 500);
    }
}
