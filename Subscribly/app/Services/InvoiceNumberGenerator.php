<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InvoiceNumberGenerator
{
    /**
     * Generate the next invoice number for a given tenant.
     *
     * @param \App\Models\Tenant $tenant
     * @return string
     */
    public function generate(Tenant $tenant): string
    {
        return DB::transaction(function () use ($tenant) {
            $now = Carbon::now();
            $yearMonth = $now->format('Y-m');

            if (
                !$tenant->last_invoice_reset_at ||
                $tenant->last_invoice_reset_at->format('Y-m') !== $yearMonth
            ) {
                $tenant->last_invoice_number = 0;
                $tenant->last_invoice_reset_at = $now;
            }

            $tenant->last_invoice_number += 1;
            $tenant->save();

            $formattedNumber = str_pad($tenant->last_invoice_number, 4, '0', STR_PAD_LEFT);
            $tenant->code='Inv';
            return "{$tenant->code}-{$yearMonth}-{$formattedNumber}";
        });
    }
}
