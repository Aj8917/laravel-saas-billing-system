<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class vendor_offers extends Model
{
    public function vendor_id()
    {
       return  $this->belongsTo(User::class);
    }

    public function variant_id()
    {
       return  $this->belongsTo(variant_attributes::class);
    }
}
