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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_no')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('subject');
            $table->enum('category', ['billing', 'technical']);
            $table->text('description');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('priority');
            $table->index('category');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
