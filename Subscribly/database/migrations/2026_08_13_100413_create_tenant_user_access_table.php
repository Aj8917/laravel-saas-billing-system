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
        Schema::create('tenant_user_access', function (Blueprint $table) {
            $table->id();
             $table->foreignId('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('status')->default('active');
            /*
                'plan_limit',
                'admin',
                'payment',
                'other',
             */
            $table->string('reason')->nullable();

            $table->timestamps();

            // One access record per user per tenant
            $table->unique(['tenant_id', 'user_id']);

            // Useful for finding active/suspended users
            $table->index(['tenant_id', 'status']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_user_access');
    }
};
