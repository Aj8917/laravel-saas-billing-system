<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable=['name','slug','cached_permissions'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public function refreshCachedPermission()
    {
        $this->cached_permissions = $this->permissions->pluck('slug')->toJson();
        $this->save();

        Cache::forget("role_permission_{$this->id}");
    }

    public function getCachedPermissions()
    {
        return Cache::rememberForever("role_permissions_{$this->id}",function(){
            return json_decode($this->cached_permissions,true)??$this->permissions()->pluck('slug')->toArray();
        });
    }
}
