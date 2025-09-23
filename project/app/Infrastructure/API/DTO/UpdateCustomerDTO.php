<?php

namespace App\Infrastructure\API\DTO;

use Spatie\LaravelData\Data;

class UpdateCustomerDTO extends Data
{
    /**
     * @param string|null $name
     * @param bool|null $email_notifications
     * @param bool|null $push_notifications
     */
    public function __construct(
        public readonly ?string $name,
        public readonly ?bool $email_notifications,
        public readonly ?bool $push_notifications,
    ) {}


    /**
     * @return string[]
     */
    public static function rules(): array
    {
        return [
            'name'                 => ['sometimes', 'min:3', 'alpha'],
            'email_notifications'  => ['sometimes', 'boolean'],
            'push_notifications'   => ['sometimes', 'boolean'],
        ];
    }
}
