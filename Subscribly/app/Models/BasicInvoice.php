<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BasicInvoice extends Model
{
    protected $fillable = ['products', 'customer_id'];

    protected $casts = [
        'products' => 'array', // Automatically cast JSON to PHP array
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

     public function vendor_id()
    {
       return  $this->belongsTo(User::class);
    }
}
