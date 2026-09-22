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
        Schema::table('fixed_numbers', function (Blueprint $table) {
            $table->bigInteger('range_start')->change();
            $table->bigInteger('range_end')->change();
            $table->bigInteger('current_number')->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->bigInteger('fixed_number')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('fixed_numbers', function (Blueprint $table) {
            $table->integer('range_start')->change();
            $table->integer('range_end')->change();
            $table->integer('current_number')->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->integer('fixed_number')->nullable()->change();
        });
    }
};
