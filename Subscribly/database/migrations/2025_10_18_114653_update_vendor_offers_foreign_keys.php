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
          Schema::table('vendor_offers', function (Blueprint $table) {
            // Drop old foreign key if exists
            $table->dropForeign(['variant_id']);

            // Add correct foreign key
            $table->foreign('variant_id')->references('id')->on('product_variants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_offers', function (Blueprint $table) {
            $table->dropForeign(['variant_id']);

            // Rollback to old if needed
            $table->foreign('variant_id')->references('id')->on('variant_attributes')->onDelete('cascade');
        });
    }
};
