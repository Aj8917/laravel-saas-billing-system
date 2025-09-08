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
        Schema::table('users', function (Blueprint $table) {
            // Rename column
            if(Schema::hasColumn('users','company_name'))
            {
            $table->renameColumn('company_name', 'tenant_id');

            // Make sure tenant_id is unsigned big integer
            $table->unsignedBigInteger('tenant_id')->change();

            // Add foreign key constraint
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            }
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            
            $table->dropForeign(['tenant_id']);
            $table->renameColumn('tenant_id','company_name');
        });
    }
};
