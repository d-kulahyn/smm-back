<?php

namespace App\Infrastructure\API\Resource;

use App\Domain\Entity\Customer;
use App\Infrastructure\API\Resource\Traits\FormatsDatesTrait;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    use FormatsDatesTrait;

    /**
     * @param $request
     *
     * @return array
     */
    public function toArray($request): array
    {
        /** @var Customer $resource */
        $resource = $this->resource;

        return [
            'id'                  => $resource->id,
            'name'                => $resource->name,
            'email'               => $resource->email,
            'avatar'              => $resource->avatar !== null ? Storage::url($resource->avatar) : null,
            'email_is_verified'   => !is_null($resource->email_verified_at),
            'email_notifications' => $resource->email_notifications,
            'push_notifications'  => $resource->push_notifications,
        ];
    }
}
