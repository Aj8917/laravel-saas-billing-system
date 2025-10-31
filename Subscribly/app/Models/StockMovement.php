<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'change_type',
        'quantity_change',
        'resulting_stock',
        'reference_type',
        'reference_id',
        'created_at',
    ];
        
    public $timestamps = false;
   
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Polymorphic relation — can link to ProInvoice, Purchase, etc.
    public function reference()
    {
        return $this->morphTo(__FUNCTION__, 'reference_type', 'reference_id');
    }
}
