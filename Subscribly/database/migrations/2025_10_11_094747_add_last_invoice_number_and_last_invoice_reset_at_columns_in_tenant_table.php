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
        Schema::table('tenants', function (Blueprint $table) {
             $table->unsignedInteger('last_invoice_number')->default(0)->after('business_name');
             $table->timestamp('last_invoice_reset_at')->nullable()->after('last_invoice_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
             $table->dropColumn('last_invoice_number');
            $table->dropColumn('last_invoice_reset_at');
        });
    }
};
