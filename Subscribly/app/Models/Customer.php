<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    public function basicInvoice()
    {
        return $this->hasMany(BasicInvoice::class);
    }

     public function vendor_id()
    {
       return  $this->belongsTo(User::class);
    }

}
