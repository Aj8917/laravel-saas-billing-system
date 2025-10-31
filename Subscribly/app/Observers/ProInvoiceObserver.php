<?php

namespace App\Observers;

use App\Models\ProInvoice;
use App\Models\StockMovement;

class ProInvoiceObserver
{
    /**
     * Handle the ProInvoice "created" event.
     */
    public function created(ProInvoice $proInvoice): void
    {
        $product = $proInvoice->offer->variant->product;

        if (!$product) {
            \Log::error("No product found for ProInvoice ID {$proInvoice->id}");
            return;
        }
        // Reduce stock based on sale quantity
        $proInvoice->offer->decrement('stock_qty', $proInvoice->sell_quantity);
        $proInvoice->offer->refresh();

        // Create stock movement record
        StockMovement::create([
            'product_id' => $product->id,
            'change_type' => 'sale',
            'quantity_change' => -$proInvoice->sell_quantity,
            'resulting_stock' => $proInvoice->offer->stock_qty,
            'reference_type' => ProInvoice::class,
            'reference_id' => $proInvoice->id,
        ]);
    }

    /**
     * Handle the ProInvoice "updated" event.
     */
    public function updated(ProInvoice $proInvoice): void
    {
        //
    }

    /**
     * Handle the ProInvoice "deleted" event.
     */
    public function deleted(ProInvoice $proInvoice): void
    {
        //
    }

    /**
     * Handle the ProInvoice "restored" event.
     */
    public function restored(ProInvoice $proInvoice): void
    {
        //
    }

    /**
     * Handle the ProInvoice "force deleted" event.
     */
    public function forceDeleted(ProInvoice $proInvoice): void
    {
        //
    }
}
