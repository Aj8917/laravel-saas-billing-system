<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    
        protected $guarded = [];
      protected $fillable = [
        'name',
        'email',
        'mobile_number',
        'status',
    ];
}
