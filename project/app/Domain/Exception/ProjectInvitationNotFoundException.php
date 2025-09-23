<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ProjectInvitationNotFoundException extends \Exception
{
    public function __construct(string $message = "Project invitation not found")
    {
        parent::__construct($message);
    }
}
