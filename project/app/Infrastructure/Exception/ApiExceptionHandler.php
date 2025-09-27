<?php

declare(strict_types=1);

namespace App\Infrastructure\Exception;

use App\Domain\Exception\BadRequestDomainException;
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

        if ($exception instanceof BadRequestDomainException) {
            return $this->handleBadRequestDomainException($exception);
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

    private function handleBadRequestDomainException(BadRequestDomainException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => $exception->getErrorCode(),
                'message' => $exception->getMessage(),
                'details' => [],
            ],
        ], $exception->getHttpStatusCode());
    }

    private function handleDomainException(DomainException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => $exception->getErrorCode(),
                'message' => $exception->getMessage(),
                'details' => $exception->getErrorDetails(),
            ],
        ], $exception->getHttpStatusCode());
    }

    private function handleValidationException(ValidationException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'VALIDATION_FAILED',
                'message' => 'Data validation error',
                'details' => [
                    'validation_errors' => $exception->errors(),
                ],
            ],
        ], 422);
    }

    private function handleAuthenticationException(AuthenticationException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'UNAUTHENTICATED',
                'message' => $exception->getMessage(),
                'details' => [],
            ],
        ], 401);
    }

    private function handleAuthorizationException(AuthorizationException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'UNAUTHORIZED',
                'message' => 'Insufficient rights to perform the operation',
                'details' => [],
            ],
        ], 403);
    }

    private function handleModelNotFoundException(ModelNotFoundException $exception): JsonResponse
    {
        $model = class_basename($exception->getModel());

        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'RESOURCE_NOT_FOUND',
                'message' => "Resource {$model} not found",
                'details' => [],
            ],
        ], 404);
    }

    private function handleNotFoundHttpException(NotFoundHttpException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'ROUTE_NOT_FOUND',
                'message' => 'Route not found',
                'details' => [],
            ],
        ], 404);
    }

    private function handleHttpException(HttpException $exception): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'HTTP_ERROR',
                'message' => $exception->getMessage() ?: 'HTTP error',
                'details' => [],
            ],
        ], $exception->getStatusCode());
    }

    private function handleGenericException(Throwable $exception): JsonResponse
    {
        if (app()->environment('production')) {
            return response()->json([
                'success' => false,
                'error'   => [
                    'code'    => 'INTERNAL_SERVER_ERROR',
                    'message' => 'Internal Server Error',
                    'details' => [],
                ],
            ], 500);
        }

        return response()->json([
            'success' => false,
            'error'   => [
                'code'    => 'INTERNAL_SERVER_ERROR',
                'message' => $exception->getMessage(),
                'details' => [
                    'file'  => $exception->getFile(),
                    'line'  => $exception->getLine(),
                    'trace' => $exception->getTraceAsString(),
                ],
            ],
        ], 500);
    }
}
