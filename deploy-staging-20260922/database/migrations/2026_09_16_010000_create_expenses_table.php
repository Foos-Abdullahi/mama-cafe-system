<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('item');
            $table->string('category')->default('Supplies');
            $table->decimal('amount', 10, 2);
            $table->date('purchased_at');
            $table->string('vendor')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['purchased_at', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
