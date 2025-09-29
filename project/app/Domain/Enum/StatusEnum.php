<?php

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum StatusEnum: string
{
    use AllCasesTrait;

    case PENDING = 'pending';
    case PAID = 'paid';
    case COMPLETED = 'completed';
    case ACTIVE = 'active';

    case READ = 'read';
    case DECLINED = 'declined';
}
