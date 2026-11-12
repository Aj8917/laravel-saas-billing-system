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
    public function invoices()
    {
        return $this->hasMany(ProInvoice::class, 'offer_id');
    }
    public function toArray()
    {
        $product = $this->variant->product;

        $attributeIds = $product->attributes()->pluck('attributes.id');

        $attributes = VariantAttribute::with('attribute:id,name')
            ->whereIn('attribute_id', $attributeIds)
            ->get(['id', 'attribute_id', 'value'])
            ->groupBy('attribute_id')
            ->map(function ($items) {
                return [
                    //'id' => $items->first()->attribute_id,
                    'name' => $items->first()->attribute->name ?? null,
                    'values' => $items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'value' => $item->value,
                        ];
                    })->unique('id')->values(),
                ];
            })->values();

        return [
            "sku" => $this->vendor_sku,
            "price" => $this->price,
            "stock" => $this->stock_qty,
            "uuid" => $product->uuid,
            "product" => $product->name,
            "attribute" => $attributes
        ];
    }

}
