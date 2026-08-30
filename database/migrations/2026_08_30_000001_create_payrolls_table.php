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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('waitress_id')->constrained('waitresses')->onDelete('cascade');
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('total_orders')->default(0);
            $table->decimal('total_sales', 10, 2)->default(0.00);
            $table->decimal('commission_rate', 5, 2)->default(0.15);
            $table->decimal('commission_amount', 10, 2)->default(0.00);
            $table->string('status')->default('paid'); // pending, paid
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};
