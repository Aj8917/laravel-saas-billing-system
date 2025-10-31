<?php

namespace App\Providers;

use App\Models\ProInvoice;
use App\Observers\ProInvoiceObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ProInvoice::observe(ProInvoiceObserver::class);
    }
}
