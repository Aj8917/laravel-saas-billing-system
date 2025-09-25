<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class attributes extends Model
{
    public function category()
    {
        return $this->belongsTo(categories::class);
    }
}
