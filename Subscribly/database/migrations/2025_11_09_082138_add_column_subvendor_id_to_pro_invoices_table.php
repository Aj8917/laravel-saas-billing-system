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
        Schema::table('pro_invoices', function (Blueprint $table) {
              if (!Schema::hasColumn('pro_invoices', 'subvendor_id')) {
            $table->unsignedBigInteger('subvendor_id')->nullable()->after('issued_at');

            $table->foreign('subvendor_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
              }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pro_invoices', function (Blueprint $table) {
            $table->dropForeign(['subvendor_id']);
            $table->dropColumn('subvendor_id');
        });
    }
};
