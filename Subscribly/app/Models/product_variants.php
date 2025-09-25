<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class product_variants extends Model
{
    public function products()
    {
        return $this->hasMany(products::class);
    }
}
