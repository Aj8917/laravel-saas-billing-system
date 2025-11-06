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
    
    public function toArray(){
       return [
            'business_name'=>$this->business_name,
            'address'=>$this->companyDetails?->address,//nullsafe
            'gstin'=>$this->companyDetails?->gstin,
            'pan'=>$this->companyDetails?->pan,
            'pincode'=>$this->companyDetails?->pincode,
            'subVendors'=>$this->users->where('role_id',3)
                                ->map(fn($user)=>[
                                    'name'=>$user->name,
                                    'email'=>$user->email
                                ])->values(),

       ] ;
    }
}
