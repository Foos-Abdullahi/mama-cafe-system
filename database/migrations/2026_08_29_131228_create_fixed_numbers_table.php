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
        Schema::create('fixed_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waitress_id')->constrained('waitresses')->onDelete('cascade');
            $table->integer('range_start');
            $table->integer('range_end');
            $table->integer('current_number');
            $table->string('status')->default('active');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fixed_numbers');
    }
};
