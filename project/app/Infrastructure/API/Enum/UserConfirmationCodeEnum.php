<?php

namespace App\Infrastructure\API\Enum;

use App\Shared\Trait\CacheKeysTrait;

enum UserConfirmationCodeEnum: string
{
    use CacheKeysTrait;

    case USER_CONFIRMATION_EMAIL_CODE = 'users:{user_id}:confirmation_email_code';
}
