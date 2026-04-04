<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_no',
        'user_id',
        'subject',
        'category',
        'description',
        'status',
        'priority',
    ];
    protected static function booted()
{
    static::created(function ($ticket) {
        $ticket->updateQuietly([
            'ticket_no' => 'TKT-' . str_pad($ticket->id, 6, '0', STR_PAD_LEFT)
        ]);
    });
}
    /**
     * Relationship: A ticket belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toArray()
{
    return [
        'id' => $this->id,
        'ticket_no' => $this->ticket_no,
        'subject' => $this->subject,
        'category' => $this->category,
        'description' => $this->description,
        'status' => $this->status,
        'priority' => $this->priority,
        'created_at' => $this->created_at,
        'user' => [
               'name' => $this->user->tenant->business_name ?? null,
            
        ],
    ];
    }

    

}
