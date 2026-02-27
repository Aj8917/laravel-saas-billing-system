<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $product;
    /**
     * Create a new notification instance.
     */
    public function __construct($product)
    {
        $this->product = $product;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
 public function toMail(object $notifiable): MailMessage
{
    $product = (object) $this->product; // cast array to object
    //\Log::info('Inside low Stock Notification '.$product->product); //  now works

    return (new MailMessage)
        ->subject('⚠️ Urgent: Low Stock Alert - ' . $product->product)
        ->greeting('Hello ' . $notifiable->name . ',')
        ->line('We would like to inform you that the following product is running low in inventory.')
        ->line('━━━━━━━━━━━━━━━━━━')
        ->line('🛍 Product: ' . $product->product)
        ->line('📦 Remaining Stock: ' . $product->stock)
        ->action('Manage Inventory', url('/stock'))
        ->line('Thank you for managing your inventory proactively.')
        ->salutation('— Inventory Management System');
}



    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
