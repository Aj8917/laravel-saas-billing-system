<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscriptions extends Model
{


   public function plan()
   {
    return $this->belongsTo(Plan::class,'plan_id','id');
   }

   public function Tenant()
   {
    return $this->belongsTo(Tenant::class,'tenant_id','id');
   }
 
   public function toArray(){
    return [
        'plan'=>$this->plan->name,

    ];
   }
}
