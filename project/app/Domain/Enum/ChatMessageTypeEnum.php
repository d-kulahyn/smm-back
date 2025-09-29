<?php

namespace App\Domain\Enum;

use App\Shared\Trait\AllCasesTrait;

enum ChatMessageTypeEnum: string
{
    use AllCasesTrait;

    case TEXT = 'text';
    case IMAGE = 'image';
    case VOICE = 'voice';
    case FILE = 'file';
}
