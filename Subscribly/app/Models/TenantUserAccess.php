<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantUserAccess extends Model
{
    protected $table = 'tenant_user_access';
    protected $fillable = [
        'status',
        'reason',
    ];
    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }
}
