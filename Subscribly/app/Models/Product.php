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
        'base_sku' => $variant->base_sku ?? null,
        'unit' => $variant->unit ?? null,
        'price' => $variant->offers->first()->price ?? null,
    ];
    }

}
