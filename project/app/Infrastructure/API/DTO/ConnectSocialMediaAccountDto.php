<?php

declare(strict_types=1);

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class ConnectSocialMediaAccountDto extends Data
{
    public function __construct(
        public int $project_id,
        public string $platform,
        public string $account_name,
        public string $account_id,
        public string $access_token,
        public ?string $refresh_token = null,
        public ?string $expires_at = null,
        public ?array $account_metadata = null,
        public ?array $permissions = null,
    ) {}

    public static function rules(): array
    {
        return [
            'project_id'       => 'required|exists:projects,id',
            'platform'         => 'required|in:instagram,facebook,tiktok,youtube,twitter,linkedin,telegram',
            'account_name'     => 'required|string|max:255',
            'account_id'       => 'required|string|max:255',
            'access_token'     => 'required|string',
            'refresh_token'    => 'nullable|string',
            'expires_at'       => 'nullable|date|after:now',
            'account_metadata' => 'nullable|array',
            'permissions'      => 'nullable|array',
        ];
    }
}
