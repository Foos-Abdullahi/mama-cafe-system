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
        Schema::table('payrolls', function (Blueprint $table) {
            $table->foreignId('fixed_number_id')->nullable()->constrained('fixed_numbers')->nullOnDelete()->after('waitress_id');
            $table->string('sent_from_number')->nullable()->after('fixed_number_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropConstrainedForeignId('fixed_number_id');
            $table->dropColumn('sent_from_number');
        });
    }
};
