<?php

namespace App\Infrastructure\API\Helpers;

use App\Infrastructure\API\DTO\PaginationMetaDto;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ApiResponseHelper
{
    /**
     * Success response with pagination
     */
    public static function successWithPagination(
        LengthAwarePaginator $paginated,
        string $message = null
    ): JsonResponse {
        $paginationMeta = PaginationMetaDto::fromPaginator($paginated);

        $response = [
            'success' => true,
            'data' => $paginated->items(),
            'pagination' => $paginationMeta->toArray(),
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response);
    }

    /**
     * Success response with pagination DTO
     */
    public static function successWithPaginationDto(
        $data,
        PaginationMetaDto $paginationMeta,
        string $message = null
    ): JsonResponse {
        $response = [
            'success' => true,
            'data' => $data,
            'pagination' => $paginationMeta->toArray(),
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response);
    }

    /**
     * Success response without pagination
     */
    public static function success($data, string $message = null, int $status = 200): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $data,
        ];

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, $status);
    }

    /**
     * Error response
     */
    public static function error(string $message, int $status = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }
}
