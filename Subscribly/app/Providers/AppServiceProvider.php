<?php

namespace App\Providers;

use App\Models\ProInvoice;
use App\Observers\ProInvoiceObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

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

        RateLimiter::for('signin', function (Request $request) {
            $key = $request->input('email') . '|' . $request->ip();

            return Limit::perMinute(3)
                ->by($key)
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'errors' => 'Too many login attempts. Please try again later.'
                    ], 429, $headers);
                });
        });
    }
}
