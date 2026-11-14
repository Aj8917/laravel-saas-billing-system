<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{   
    protected $fillable = [
        'attribute_id',
        'value',
       ];  
     public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }
     public function invoices()
    {
        return $this->belongsToMany(
            ProInvoice::class,
            'pro_invoice_product_attribute',
            'product_attribute_id',
            'invoice_id'
        )->withTimestamps();
    }
}
