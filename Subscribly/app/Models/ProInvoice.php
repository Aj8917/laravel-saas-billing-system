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
