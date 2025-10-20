<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorOffer extends Model
{

    protected $hidden = ['id'];
    protected $fillable = [
        'variant_id',
        'vendor_id',
        'price',
        'vendor_sku',
        'stock_qty',
        'is_active'
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function toArray()
    {
        return [
            "sku" => $this->vendor_sku,
            "price" => $this->price,
            "stock" => $this->stock_qty,
            "uuid" => $this->variant->product->uuid,
            "product" => $this->variant->product->name,

        ];
    }

}
