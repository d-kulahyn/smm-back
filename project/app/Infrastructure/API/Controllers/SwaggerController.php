<?php

namespace App\Infrastructure\API\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="SMM Project API",
 *     version="1.0.0",
 *     description="API for SMM project management system",
 *     @OA\Contact(
 *         email="admin@example.com"
 *     )
 * )
 *
 * @OA\Server(
 *     url="http://localhost/v1",
 *     description="Development server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class SwaggerController
{
}
