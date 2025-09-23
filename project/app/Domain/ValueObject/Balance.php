<?php

declare(strict_types=1);

namespace App\Domain\ValueObject;

use Spatie\LaravelData\Data;

/**
 * @property-read float $balance
 */
class Balance extends Data
{
    /**
     * @param float $owe
     * @param float $paid
     * @param int|null $customerId
     */
    public function __construct(
        public float $owe = 0.0,
        public float $paid = 0.0,
        public ?int $customerId = null
    ) {}

    public function __get(string $name)
    {
        if ($name === 'balance') {
            return (float)bcsub((string)$this->paid, (string)$this->owe, 2);
        }

        return null;
    }
}
