<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Storybook;

interface StorybookWriteRepositoryInterface
{
    public function create(array $data): Storybook;

    public function update(int $id, array $data): Storybook;

    public function delete(int $id): bool;

    public function updateStatus(int $id, string $status): Storybook;

    public function markAsExpired(int $id): Storybook;

    public function activateStory(int $id): Storybook;
}
