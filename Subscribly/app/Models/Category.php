<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable=['name'];

    public function toArray(){
        return [
                'id'=>$this->id,
                'name'=>$this->name
        ];
    }
}
