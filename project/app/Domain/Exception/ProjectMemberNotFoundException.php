<?php

declare(strict_types=1);

namespace App\Domain\Exception;

class ProjectMemberNotFoundException extends \Exception
{
    public function __construct(string $message = "Project member not found")
    {
        parent::__construct($message);
    }
}
