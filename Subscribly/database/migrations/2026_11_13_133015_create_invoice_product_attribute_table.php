<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pro_invoice_product_attribute', function (Blueprint $table) {
            $table->id();

            $table->foreignId('invoice_id')
                ->constrained('pro_invoices')
                ->cascadeOnDelete();

            $table->foreignId('product_attribute_id')
                ->constrained('variant_attributes')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'invoice_id',
                'product_attribute_id'
            ]);

           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_product_attribute');
    }
};
