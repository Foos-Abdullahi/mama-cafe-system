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
        Schema::create('daily_closings', function (Blueprint $table) {
            $table->id();
            $table->date('closing_date')->unique();
            $table->integer('total_orders')->default(0);
            $table->decimal('total_sales', 10, 2)->default(0.00);
            $table->decimal('cash_expected', 10, 2)->default(0.00);
            $table->decimal('cash_actual', 10, 2)->default(0.00);
            $table->decimal('mobile_money_total', 10, 2)->default(0.00);
            $table->decimal('card_total', 10, 2)->default(0.00);
            $table->decimal('credit_total', 10, 2)->default(0.00);
            $table->decimal('variance', 10, 2)->default(0.00); // cash_actual - cash_expected
            $table->text('notes')->nullable();
            $table->foreignId('closed_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_closings');
    }
};
