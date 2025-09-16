<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'business_name',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function CompanyDetails()
    {
        return $this->hasOne(CompanyDetail::class);
    }
}
