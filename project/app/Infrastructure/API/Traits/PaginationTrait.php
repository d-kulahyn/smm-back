<?php

namespace App\Infrastructure\API\Traits;

use App\Infrastructure\API\DTO\PaginationParamsDto;
use App\Infrastructure\API\DTO\PaginationMetaDto;
use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

trait PaginationTrait
{
    /**
     * Get pagination parameters from request
     */
    protected function getPaginationParams(Request $request): PaginationParamsDto
    {
        return PaginationParamsDto::fromRequest($request);
    }

    /**
     * Format pagination meta data
     */
    protected function formatPaginationMeta(LengthAwarePaginator $paginated): PaginationMetaDto
    {
        return PaginationMetaDto::fromPaginator($paginated);
    }
}
