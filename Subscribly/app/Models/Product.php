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

    public function attributes()
    {
        return $this->belongsToMany(
            Attribute::class,
            'product_attributes',
            'product_id',
            'attribute_id'
        )->withPivot('id');
    }

    public function toArray()
    {
        $variant = $this->variants()
            ->with([
                'offers.vendor',
                'offers.invoices.productAttributes.attribute',
            ])
            ->first();

        $offers = $variant?->offers ?? collect();
        $invoices = $offers->flatMap(fn($offer) => $offer->invoices);

        $attributeIds = $this->attributes()->pluck('attributes.id');

        $attributes = VariantAttribute::with('attribute:id,name')
            ->whereIn('attribute_id', $attributeIds)
            ->get(['id', 'attribute_id', 'value'])
            ->groupBy('attribute_id')
            ->map(function ($items) {
                return [
                    'name' => $items->first()->attribute?->name,
                    'values' => $items->map(fn($item) => [
                        'id' => $item->id,
                        'value' => $item->value,
                    ])->unique('id')->values(),
                ];
            })
            ->values();

        $sellByAttribute = $invoices
            ->flatMap(function ($invoice) {
                return $invoice->productAttributes->map(fn($item) => [
                    'attribute_id' => $item->attribute_id,
                    'attribute' => $item->attribute?->name,
                    'value' => $item->value,
                    'sell_quantity' => (float) $invoice->sell_quantity,
                ]);
            })
            ->groupBy('attribute_id')
            ->flatMap(fn($items) => $items->groupBy('value')->map(function ($valueItems) {
                $first = $valueItems->first();

                return [
                    'attribute_id' => $first['attribute_id'],
                    'attribute' => ucfirst($first['attribute']),
                    'value' => ucfirst($first['value']),
                    'total_sell' => $valueItems->sum('sell_quantity'),
                ];
            }))
            ->values();

        return [
            'name' => $this->name,
            'uuid' => $this->uuid,
            'base_sku' => $variant?->base_sku,
            'unit' => $variant?->unit,
            'price' => $offers->first()?->price,
            'attribute' => $attributes,
            'sell_by_attribute' => $sellByAttribute,
            'vendor' => $offers->first()?->vendor?->name,
            'total_sell' => $invoices->sum('sell_quantity'),
            'subtotal' => $invoices->sum('subtotal'),
            'total_tax' => $invoices->sum('tax_total'),
            'total' => $invoices->sum('total'),
            'sales_chart' => $invoices
                ->groupBy(fn($invoice) => \Carbon\Carbon::parse($invoice->issued_at)->format('M'))
                ->map(fn($items, $month) => [
                    'month' => $month,
                    'sales' => $items->sum('sell_quantity'),
                ])
                ->values(),
        ];
    }

}
