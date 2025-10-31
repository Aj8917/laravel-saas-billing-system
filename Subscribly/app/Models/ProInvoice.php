<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProInvoice extends Model
{
    protected $fillable = ['cust_id', 'offer_id', 'invoice_no', 'sell_quantity', 'issued_at', 'price', 'subtotal', 'tax_total', 'total'];
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'cust_id', 'id');
    }

    public function offer()
    {
        return $this->belongsTo(VendorOffer::class, 'offer_id', 'id');
    }
     // 🔹 Indirect relationship: ProInvoice → Offer → Variant → Product
    public function product()
    {
        return $this->hasOneThrough(
            Product::class,
            ProductVariant::class,
            'id',          // Foreign key on variants table
            'id',          // Foreign key on products table
            'offer_id',    // Local key on pro_invoices table (through offer)
            'product_id'   // Local key on variants table
        );
    }

    // 🔹 Stock movements related to this invoice
    public function stockMovements()
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }
    public function toArray()
    {
        return [
            "name" => $this->customer->name,
            "mobile" => $this->customer->mobile,
            "invoice_no" => $this->invoice_no,
            "product_name" =>  $this->offer->variant->product->name,
            "price" => $this->price,
            "sell_quantity" => $this->sell_quantity,
            "subtotal" => $this->subtotal,
            "tax_total" => $this->tax_total,
            "total" => $this->total,
            "issued_at" => $this->issued_at,
        ];
    }
}
