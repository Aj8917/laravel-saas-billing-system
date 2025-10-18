<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
   protected $fillable = ['name', 'category_id'];

    public function Category()
    {
        return $this->belongsTo(Category::class);
    }
}
