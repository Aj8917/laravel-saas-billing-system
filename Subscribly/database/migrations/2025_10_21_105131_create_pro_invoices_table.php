<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      
            if (!Schema::hasTable('pro_invoices')) {
            Schema::create('pro_invoices', function (Blueprint $table) {
                $table->id();
                $table->foreignId('cust_id')->constrained('customers')->cascadeOnDelete();
                $table->foreignId('offer_id')->constrained('vendor_offers')->cascadeOnDelete();
                $table->string('invoice_no');
                $table->integer('sell_quantity');
                $table->decimal('price', 12, 2)->default(0);
                $table->decimal('subtotal', 12, 2)->default(0);
                $table->decimal('tax_total', 12, 2)->default(0);
                $table->decimal('total', 12, 2)->default(0);
                $table->date('issued_at');
                $table->timestamps();
            });
        }
  
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pro_invoices');
    }
};
