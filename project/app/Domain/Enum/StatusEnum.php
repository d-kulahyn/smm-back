<?php

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum StatusEnum: string
{
    use AllCasesTrait;

    case PENDING = 'pending';
    case PAID = 'paid';
    case COMPLETED = 'on_hold';
    case ACTIVE = 'active';

    case READ = 'read';
    case DECLINED = 'declined';
}
