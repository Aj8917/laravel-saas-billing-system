<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $hidden=['id','product.id'];
    protected $fillable = [
        'product_id',
        'base_sku',
       
    ];
      public function product()
    {
        return $this->belongsTo(Product::class);
    }

   
    public function offers() 
    {
            return $this->hasMany(VendorOffer::class, 'variant_id');
    }
}
