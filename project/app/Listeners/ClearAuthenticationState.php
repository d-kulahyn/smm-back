<?php

namespace App\Listeners;

use Illuminate\Contracts\Auth\Factory as AuthFactory;

class ClearAuthenticationState
{
    public function handle(): void
    {
        app(AuthFactory::class)->forgetGuards();
    }
}

