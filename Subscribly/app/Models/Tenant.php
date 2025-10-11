<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'business_name',
    ];
    protected $casts = [
    'last_invoice_reset_at' => 'datetime',
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
