<?php

namespace App\Domain\Enum;

enum ActivityLogActionTypeEnum: string
{
    case MEMBER_ADDED_TO_GROUP = 'MEMBER_ADDED_TO_PROJECT';
}
