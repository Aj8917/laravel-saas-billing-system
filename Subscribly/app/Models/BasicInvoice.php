<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BasicInvoice extends Model
{
    protected $hidden = ['cust_id'];
    
    protected $fillable = ['products', 'cust_id','vendor_id','product_name','sell_quantity','issued_at','price','subtotal','tax_total','total','invoice_no'];

    protected $casts = [
        'products' => 'array', // Automatically cast JSON to PHP array
    ];
    
    public function customer()
    {
        return $this->belongsTo(Customer::class,'cust_id','id');
    }

    public function vendor()
{
    return $this->belongsTo(User::class, 'vendor_id', 'id');
}

}
