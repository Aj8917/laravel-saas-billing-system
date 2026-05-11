<?php

namespace App\Models;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'uuid'];

    // Keep this as is — no need to change key type
    public $incrementing = true;
    protected $keyType = 'int';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function toArray()
    {
        $variant = $this->variants->first();

        return [
            'name' => $this->name,
            'uuid' => $variant->product->uuid ?? null,
            'base_sku' => $variant->base_sku ?? null,
            'unit' => $variant->unit ?? null,
            'price' => $variant->offers->first()->price ?? null,
            'attribute' => $variant->attributes->value ?? null,
            // Total sold quantity from all invoices
            'total_sell' => $variant->offers
                ->flatMap(fn($offer) => $offer->invoices)
                ->sum('sell_quantity'),

            // Total subtotal from all invoices
            'subtotal' => $variant->offers
                ->flatMap(fn($offer) => $offer->invoices)
                ->sum('subtotal'),
            'total_tax' => $variant->offers 
                ->flatMap(fn($offer) => $offer->invoices)
                ->sum('tax_total'),
            'total' =>$variant->offers
                    ->flatMap(fn($offer)=>$offer->invoices)
                    ->sum('total')
        ];
    }

}
