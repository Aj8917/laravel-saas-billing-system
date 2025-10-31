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
        Schema::create('stock_movements', function (Blueprint $table) {
             $table->id();
            $table->unsignedBigInteger('product_id');
            $table->enum('change_type', ['purchase', 'sale', 'adjustment'])->index();
            $table->integer('quantity_change');
            $table->integer('resulting_stock');
            $table->string('reference_type')->nullable(); // e.g. Purchase, Sale
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // add indexes and foreign keys
            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->cascadeOnDelete();

            $table->index(['reference_type', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
