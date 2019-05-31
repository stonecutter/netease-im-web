<?php

namespace StoneCutter\NetEaseIMWeb;

use Illuminate\Support\ServiceProvider;

class PackageServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__.'/public' => public_path('vendor/netease-im-web'),
        ], 'netease-im-web');
    }
}
