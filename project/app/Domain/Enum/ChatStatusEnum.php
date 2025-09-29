<?php

declare(strict_types=1);

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum ChatStatusEnum: string
{
    use AllCasesTrait;

    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case ARCHIVED = 'archived';
}
