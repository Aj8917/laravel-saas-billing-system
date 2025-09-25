<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class variant_attributes extends Model
{
    public function arrtibutes()
    {
        return $this->belongsTo(attributes::class);
    }
}
