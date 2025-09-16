<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyDetail extends Model
{
    protected $fillable = [
        'tenant_id',
        'address',
        'businessType',
        'city',
        'gstin',
        'industry',
        'pan',
        'pincode',
        'state',
    ];
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}//companydeta
