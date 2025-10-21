<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProInvoice extends Model
{
    protected $fillable=['cust_id','offer_id','invoice_no','sell_quantity','issued_at','price','subtotal','tax_total','total'];
    public function customer()
    {
        return $this->belongsTo(Customer::class,'cust_id','id');
    }

     public function offer()
    {
        return $this->belongsTo(VendorOffer::class, 'offer_id', 'id');
    }
}
