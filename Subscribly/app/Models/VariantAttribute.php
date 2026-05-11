<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{   
    protected $fillable = [
        'attribute_id',
        'value',
       ];  
    public function attributes()
    {
        return $this->belongsTo(Attribute::class);
    }
}
