<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProInvoiceProductAttribute extends Model
{
     protected $table = 'pro_invoice_product_attribute';

    protected $fillable = [
        'invoice_id',
        'product_attribute_id',
    ];
}
